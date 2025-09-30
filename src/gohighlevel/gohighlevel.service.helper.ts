import { batchProcessor } from '@src/utils/batchProcessor';

import { GohighlevelConversion } from './entities/gohighlevel.conversion.entity';
import { Conversation, ConversationMessage } from './gohighlevel.types';
import { GohighlevelConversionMessage } from './entities/gohighlevel.messages.entity';

export class GohighlevelServiceHelper {

 async formatterConversationMessages(conversationMessages: Array<ConversationMessage>): Promise<Array<GohighlevelConversionMessage>> {

  if (!conversationMessages?.length) {
   return []
  }

  const formatterConversionMessages = await batchProcessor(conversationMessages, async (messageDetails, i) => {
   return {
    conversation_ref: messageDetails.conversationId,
    message_ref: messageDetails.id,
    type: messageDetails.messageType,
    direction: messageDetails.direction,
    contact_ref: messageDetails.contactId,
    details: messageDetails,
   };
  });

  // @ts-ignore
  return formatterConversionMessages as Array<GohighlevelConversionMessage>
 }

 async formatterConversation(conversations: Array<Conversation & { last_messages_count: number }>, last_message_id: string): Promise<Array<GohighlevelConversion>> {

  if (!conversations?.length) {
   return []
  }

  const formatterConversion = await batchProcessor(conversations, async (conversationDetail, i) => {
   return {
    conversation_ref: conversationDetail.id,
    contact_ref: conversationDetail.contactId,
    last_message_direction: conversationDetail.lastMessageDirection,
    last_message_ref: last_message_id,
    details: conversationDetail,
    last_messages_count: conversationDetail.last_messages_count,
   };
  });

  // @ts-ignore
  return formatterConversion as Array<GohighlevelConversion>
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

 selectConversationAction(actionType: string) {
  switch (actionType) {
   case "OutboundMessage":
    return true
   case "InboundMessage":
    return true
   default:
    return false
  }
 }
}