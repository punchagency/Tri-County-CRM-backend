import { batchProcessor } from '@src/utils/batchProcessor';

import { Conversation, ConversationMessage, ConversationMessageType } from './gohighlevel.types';
import { GohighlevelConversionMessage } from './entities/gohighlevel.messages.entity';

export class GohighlevelServiceHelper {

  async formatterConversationMessages(conversationMessages: Array<ConversationMessage> | ConversationMessage): Promise<Array<GohighlevelConversionMessage>> {
    const isArrayType = Array.isArray(conversationMessages);
    const list = isArrayType ? conversationMessages : [conversationMessages]

    if (!list?.length) {
      return []
    }

    const formatterConversionMessages = await batchProcessor(list, async (messageDetails, i) => {
      return {
        conversation_ref: messageDetails.conversationId,
        message_ref: messageDetails.id,
        type: messageDetails.messageType,
        direction: messageDetails.direction,
        contact_ref: messageDetails.contactId,
        details: messageDetails,
      };
    });

    return (isArrayType ? formatterConversionMessages : formatterConversionMessages[0]) as any
  }

  async formatterConversation(conversations: Array<Conversation & { last_messages_count: number }> | Conversation & { last_messages_count: number }, last_message_id: string) {
    const isArrayType = Array.isArray(conversations);
    const list = isArrayType ? conversations : [conversations]

    if (!list?.length) {
      return []
    }

    const formatterConversion = await batchProcessor(list, async (conversationDetail, i) => {
      return {
        conversation_ref: conversationDetail.id,
        contact_ref: conversationDetail.contactId,
        last_message_direction: conversationDetail.lastMessageDirection || "no message",
        last_message_ref: last_message_id || "no-message-id",
        details: conversationDetail,
        last_messages_count: conversationDetail.last_messages_count || 0,
      };
    });

    // @ts-ignore
    return (isArrayType ? formatterConversion : formatterConversion[0]) as any
  }

  /**
   * Find and update message with attachment
   * NOTE: This is important because the gohighlevel webhook does not return the attachment reference
   * @param messages - Array of conversation messages
   * @param currentMessage - Current message
   * @returns Array of conversation messages with attachment
   */
  findAndUpdateMessageWithAttachment(messages: Array<ConversationMessage>, currentMessage: any) {
    const { contactId, conversationId, dateAdded, status, attachments } = currentMessage;

    return messages.map(message => {
      const isMatch = message.contactId === contactId && message.conversationId === conversationId && message.dateAdded === dateAdded && message.status === status

      if (isMatch) {
        return {
          ...message,
          attachments
        }
      }
      return message;
    });
  }

  selectedAction(actionType: ConversationMessageType) {
    if (!actionType) {
      return false
    }

    switch (actionType) {
      case ConversationMessageType.OUTBOUND:
      case ConversationMessageType.INBOUND:
        return true
      case ConversationMessageType.CONTACT_CREATE:
      case ConversationMessageType.CONTACT_DELETE:
      case ConversationMessageType.CONTACT_DND_UPDATE:
      case ConversationMessageType.CONTACT_TAG_UPDATE:
        return true
      case ConversationMessageType.CONTACT_CUSTOMER:
      case ConversationMessageType.CONTACT_LEAD:
        return true
      default:
        return false
    }
  }

}