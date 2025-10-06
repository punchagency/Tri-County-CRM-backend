import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getAppConfig } from '@src/config';
import { GohighlevelConversion } from './entities/gohighlevel.conversion.entity';
import { ConversationMessages, Conversations } from './gohighlevel.conversation';
import { ConversationMessageType } from './gohighlevel.types';
import { GohighlevelConversionMessage } from './entities/gohighlevel.messages.entity';
import { GohighlevelContact } from './entities/gohighlevel.contact.entity';
import { GohighlevelRepo } from './gohighlevel.repo';


@Injectable()
export class GohighlevelConversationService {
  private logger = new Logger(GohighlevelConversationService.name)
  private conversations: Conversations;
  private conversationMessages: ConversationMessages;
  private gohighlevelRepo: GohighlevelRepo


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
    this.gohighlevelRepo = new GohighlevelRepo({
      gohighlevelContactRepository,
      gohighlevelConversionMessageRepository,
      gohighlevelConversionRepository
    })
  }

  async conversationHandle(body: { type: ConversationMessageType, conversationId: string, contact_id_from_db: string }) {
    try {
      const allowedTypes = [
        ConversationMessageType.INBOUND,
        ConversationMessageType.OUTBOUND
      ];

      if (!allowedTypes.includes(body.type) || !body.conversationId || !body.contact_id_from_db) {
        return;
      }

      const conversationDetails = await this.conversations.getConversationDetail(body.conversationId);

      // awaiting this process is necess for squential execution when in-use next to message handle
      return await this.gohighlevelRepo.saveOrUpdateConversion({ ...conversationDetails, contact_id_from_db: body.contact_id_from_db });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async meassageHandle(body: {
    type: ConversationMessageType,
    conversationId: string,
    conversation_id_from_db: string
  }) {
    try {
      const allowedTypes = [
        ConversationMessageType.INBOUND,
        ConversationMessageType.OUTBOUND
      ];

      if (!allowedTypes.includes(body.type) || !body.conversationId || !body.conversation_id_from_db) {
        return;
      }

      const conversationMessages = await this.conversationMessages.getMessages(body.conversationId)

      return await this.gohighlevelRepo.saveNewMesssageOnly({
        conversation_id_from_db: body.conversation_id_from_db,
        message_array_or_object: conversationMessages
      })

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async conversationAndMessageHandle(payload) {
    try{
    const contact = payload?.contact_id_from_db ? payload : await this.gohighlevelContactRepository.findOneBy({ contact_ref: payload.contactId })

    // the conversion should process first
    const savedConversation = await this.conversationHandle({ ...payload, contact_id_from_db: payload?.contact_id_from_db || contact.id });
    this.meassageHandle({ ...payload, conversation_id_from_db: savedConversation.id });
  } catch(error) {
      this.logger.log(error)
  }
  }
}