import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getAppConfig } from '@src/config';
import { batchProcessor } from '@src/utils/batchProcessor';

import { GohighlevelConversion } from './entities/gohighlevel.conversion.entity';
import { ConversationMessages, Conversations } from './gohighlevel.conversation';
import { Conversation, ConversationMessage, ConversationMessageType } from './gohighlevel.types';
import { GohighlevelConversionMessage } from './entities/gohighlevel.messages.entity';
import { GohighlevelServiceHelper } from './gohighlevel.service.helper';
import { GohighlevelContact } from './entities/gohighlevel.contact.entity';


@Injectable()
export class GohighlevelConversationService {
  private conversations: Conversations;
  private conversationMessages: ConversationMessages;
  private gohighlevelServiceHelper: GohighlevelServiceHelper;


  constructor(
    @InjectRepository(GohighlevelConversion)
    private readonly gohighlevelConversionRepository: Repository<GohighlevelConversion>,
    @InjectRepository(GohighlevelConversionMessage)
    private readonly gohighlevelConversionMessageRepository: Repository<GohighlevelConversionMessage>,
    @InjectRepository(GohighlevelContact)
    private readonly gohighlevelContactRepository: Repository<GohighlevelContact>,
    private readonly configService: ConfigService,
  ) {
    const config = getAppConfig(this.configService);

    this.conversations = new Conversations({ gohighlevel: config.api.gohighlevel });
    this.conversationMessages = new ConversationMessages({ gohighlevel: config.api.gohighlevel, awsS3Bucket: config.api.s3 });
    this.gohighlevelServiceHelper = new GohighlevelServiceHelper();
  }

  private async hasNewMessageInConversation({ conversation, messages_count }: { conversation: GohighlevelConversion, messages_count: number }) {

    const existingConversation = await this.gohighlevelConversionRepository.findOne({
      where: {
        conversation_ref: conversation.conversation_ref,
      }
    });
    const last_messages_count = existingConversation?.last_messages_count


    return messages_count !== last_messages_count
  }

  private async saveOrUpdateConversion(conversation: GohighlevelConversion) {

    if (!conversation) {
      return
    }

    const conversation_ref = conversation.conversation_ref
    const [existingConversation, contact] = await Promise.all([
      this.gohighlevelConversionRepository.findOneBy({
        conversation_ref,
      }),
      this.gohighlevelContactRepository.findOneBy({ contact_ref: conversation.contact_ref })
    ]);


    if (existingConversation) {
      return this.gohighlevelConversionRepository.update({ conversation_ref }, conversation);
    }
    return this.gohighlevelConversionRepository.save({ ...conversation, contact: { id: contact.id } });
  }

  private async saveNewMesssageOnly(messages: Array<GohighlevelConversionMessage>, conversation_ref: string,
  ) {

    if (!messages?.length) {
      return
    }

    const [conversation, existingmessages] = await Promise.all([
      this.gohighlevelConversionRepository.findOneBy({
        conversation_ref,
      }),
      this.gohighlevelConversionMessageRepository.find({
        where: {
          conversation_ref: conversation_ref,
        }
      })
    ])
    const messageIds = existingmessages.map(item => item.message_ref)

    await batchProcessor(messages, async (message, i) => {
      // check if messsage is new
      if (!messageIds.includes(message.message_ref)) {
        this.gohighlevelConversionMessageRepository.save({ ...message, conversation: { id: conversation?.id } })
      }
    })

  }

  private async saveConversationMessages({ conversation, last_message_id, messages }: { messages?: Array<ConversationMessage>, last_message_id: string, conversation?: Conversation }) {
    try {

      const [formattedConversions = [], formattedConversationMessages = []] = await Promise.all([
        this.gohighlevelServiceHelper.formatterConversation([{ ...conversation, last_messages_count: messages?.length || 0 }], last_message_id),
        this.gohighlevelServiceHelper.formatterConversationMessages(messages)
      ]);

      // formatted conversion is only constantly a single conversion 
      const conversationFormatted = formattedConversions?.[0]
      const conversationMessagesFormatted = formattedConversationMessages;
      const messages_count = conversationMessagesFormatted.length

      // check if the conversation have new messages
      const hasNewMassage = await this.hasNewMessageInConversation({
        conversation: conversationFormatted,
        messages_count
      })

      if (hasNewMassage) {
        // save conversation messages to database
        await this.saveOrUpdateConversion(conversationFormatted);// conversation should save before messages based on relationship
        this.saveNewMesssageOnly(formattedConversationMessages, conversationFormatted.conversation_ref);
      }

    } catch (error) {
      throw new BadRequestException(`Error: ${error.message}`);
    }

  }

  async conversationHandle(body: any) {
    try {
      const allowedTypes = [
        ConversationMessageType.INBOUND,
        ConversationMessageType.OUTBOUND
      ];

      if (!allowedTypes.includes(body.type)) {
        return;
      }

      const [conversationDetailsForMessage, conversationMessageDetails] = await Promise.all([
        this.conversations.getConversationDetail(body.conversationId),

        // call the list of messages because the webhook does not return the reference of the message
        this.conversationMessages.getMessages(body.conversationId)
      ]);


      this.saveConversationMessages({
        conversation: conversationDetailsForMessage,
        messages: this.gohighlevelServiceHelper.findAndUpdateMessageWithAttachment(conversationMessageDetails.messages, body),
        last_message_id: conversationMessageDetails.last_message_id
      });

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}