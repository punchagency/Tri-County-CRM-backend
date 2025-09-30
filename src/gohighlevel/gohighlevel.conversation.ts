import { BadRequestException, Logger } from '@nestjs/common';

import { ApiConfig } from '@src/config';
import { batchProcessor } from '@src/utils/batchProcessor';
import { makeCallWithAxios } from '@src/utils/client/makeCallWithAxios';
import { AwsS3Bucket } from '@src/utils/AwsS3Bucket';

import { Conversation, ConversationMessage, ConversationMessageDetailResponse, ConversationMessageResponse } from './gohighlevel.types';
import { GohighlevelServiceApi } from './gohighlevel.api';

export class ConversationMessages {
  private static gohighlevel: ApiConfig['gohighlevel'];
  private static awsS3Bucket: AwsS3Bucket;

  constructor({ gohighlevel, awsS3Bucket }: { gohighlevel: ApiConfig['gohighlevel'], awsS3Bucket: ApiConfig['s3'] }) {
    ConversationMessages.gohighlevel = gohighlevel;
    ConversationMessages.awsS3Bucket = new AwsS3Bucket({ s3: awsS3Bucket });
  }

  async getMessages(conversationId: string): Promise<{ messages: Array<ConversationMessage>, last_message_id: string }> {
    try {

      const api = GohighlevelServiceApi.api({ gohighlevel: ConversationMessages.gohighlevel, conversationId });

      const response = await makeCallWithAxios(api.single_conversation_request_messages);
      const responseData = response.data as ConversationMessageResponse;
      const messages = responseData.messages.messages;
      const last_message_id = responseData.messages.lastMessageId;

      return { messages, last_message_id };
    } catch (error) {
      throw new BadRequestException(`getMessages Error: ${error.message}`);
    }
  }

  async getRecording(conversationId: string): Promise<{ messages: Array<ConversationMessage>, last_message_id: string }> {
    try {
      const { messages: recordingMessages, last_message_id } = await this.getMessages(conversationId);

      // get relative call records
      const messages = await batchProcessor(recordingMessages, async (item, i) => {

        const s3Object = await this.getCallRecordByMessageId(item.id);
        return {
          ...item,
          record_details: s3Object.details,
          record_url: s3Object.url,
        }
        return item;

      }, true);

      return { messages, last_message_id };
    } catch (error) {
      throw new BadRequestException(`getRecording Error: ${error.message}`);
    }
  }

  private async getCallRecordByMessageId(messageId: string): Promise<any> {
    try {
      const api = GohighlevelServiceApi.api({ gohighlevel: ConversationMessages.gohighlevel, messageId });

      const response = await makeCallWithAxios(api.recording_request);
      const content = response.data.content;

      // upload recording to s3
      if (content) {
        const uploadedObject = await ConversationMessages.awsS3Bucket.uploadRecordingToS3(content);
        return {
          url: uploadedObject.url,
          details: uploadedObject.details,
        };

      }
    } catch (error) {
      throw new BadRequestException(`getCallRecordByMessageId Error: ${error.message}`);
    }
  }

  async getMessageDetail(messageId: string): Promise<ConversationMessageDetailResponse> {
    const api = GohighlevelServiceApi.api({ gohighlevel: ConversationMessages.gohighlevel, messageId });

    const response = await makeCallWithAxios(api.single_message_request_detail);

    return response.data as ConversationMessageDetailResponse;
  }
}


export class Conversations {
  private gohighlevel: ApiConfig['gohighlevel'];
  private logger: Logger;

  constructor({ gohighlevel }: { gohighlevel: ApiConfig['gohighlevel'] }) {
    this.gohighlevel = gohighlevel;
    this.logger = new Logger(Conversations.name);
  }

  async getAll(): Promise<{ sms_conversations: Array<Conversation>, call_conversations: Array<Conversation> }> {
    try {
      const api = GohighlevelServiceApi.api({ gohighlevel: this.gohighlevel });

      // using parallel approach to get conversations from both sms and call
      let [
        { data: smsConversations, error: smsError },
        { data: callConversations, error: callError }
      ] = await Promise.all([
        makeCallWithAxios(api.sms_conversations_request_inbound),
        makeCallWithAxios(api.call_conversations_request_inbound),
        makeCallWithAxios(api.sms_conversations_request_outbound),
        makeCallWithAxios(api.call_conversations_request_outbound),
      ]);

      // if there is an error, set the conversations to an empty array
      if (smsError) {
        this.logger.error('Failed to get conversations sms: ', smsError);
        smsConversations = [];
      }

      // if there is an error, set the conversations to an empty array
      if (callError) {
        this.logger.error('Failed to get conversations call: ', callError);
        callConversations = [];
      }


      return {
        sms_conversations: smsConversations,
        call_conversations: callConversations,
      };
    } catch (error) {
      throw new BadRequestException(`getAll Error: ${error.message}`);
    }
  }

  async getConversationDetail(conversationId: string): Promise<Conversation> {
    try{
      const api = GohighlevelServiceApi.api({ gohighlevel: this.gohighlevel, conversationId });

      const response = await makeCallWithAxios(api.single_conversation_request_detail);

      return response.data as Conversation;
    } catch(error) {
      throw new BadRequestException(`getConversationDetail Error: ${error.message}`);
    }
  }
}