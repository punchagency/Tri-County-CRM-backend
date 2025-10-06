import { batchProcessor } from '@src/utils/batchProcessor';
import { GohighlevelServiceHelper } from './gohighlevel.service.helper';

export class GohighlevelRepo {
 private gohighlevelConversionRepository
 private gohighlevelContactRepository
 private gohighlevelConversionMessageRepository
 private gohighlevelServiceHelper

 constructor({
  gohighlevelConversionRepository,
  gohighlevelContactRepository,
  gohighlevelConversionMessageRepository }: {
   gohighlevelConversionRepository?: any,
   gohighlevelContactRepository?: any,
   gohighlevelConversionMessageRepository?: any
  }) {

  this.gohighlevelConversionMessageRepository = gohighlevelConversionMessageRepository
  this.gohighlevelContactRepository = gohighlevelContactRepository
  this.gohighlevelConversionRepository = gohighlevelConversionRepository
  this.gohighlevelServiceHelper = new GohighlevelServiceHelper()
 }

 /**
  * For conversation
  * NOTE: Make sure to add  `contact_id_from_db` for relationship and it is required when saving (i.e first time only)
  * @param conversation 
  * @returns 
  */
 async saveOrUpdateConversion(conversation) {
  console.log("repo conversation", conversation)

  if (!conversation) {
   return
  }

  const formattedConversation = await this.gohighlevelServiceHelper.formatterConversation(conversation);
  const existingConversation = await this.gohighlevelConversionRepository.findOneBy({
   id: formattedConversation.contact_id_from_db,
  });

  if (existingConversation) {
   this.gohighlevelConversionRepository.update({ id: formattedConversation.contact_id_from_db }, formattedConversation);

   return existingConversation
  }
  return this.gohighlevelConversionRepository.save({ ...formattedConversation, contact: { id: conversation.contact_id_from_db } });
 }

 /**
  * For Message
  * NOTE: Make sure to add `conversation_id_from_db` for relationship and it is required when saving (i.e first time only).
  * @param prop { conversation_id_from_db, message_array_or_object }
  * @returns 
  */
 async saveNewMesssageOnly({ conversation_id_from_db, message_array_or_object }) {
  const messageValues = message_array_or_object?.messages || message_array_or_object
  const last_message_id = message_array_or_object?.last_message_id
  const list = Array.isArray(messageValues) ? messageValues : [message_array_or_object]
  console.log("repo messages", messageValues, "conversation_ref", conversation_id_from_db, "last_message_id", last_message_id)

  if (!list?.length) {
   return
  }


  const messagesCountValues = await batchProcessor(list, async (message, i) => {
   const hasCurrentMessage = await this.gohighlevelConversionMessageRepository.findOneBy({
    message_ref: message.id,
   });

   // check if messsage is new
   if (!hasCurrentMessage) {
    const formattedMessage = await this.gohighlevelServiceHelper.formatterConversationMessages(message)
    this.gohighlevelConversionMessageRepository.save({ ...formattedMessage, conversation_ref: message.conversationId,  conversation: { id: conversation_id_from_db } })
   }

   return 1
  })

  // update message count and last message ref on conversation
  const payload = last_message_id ? { 
   last_message_ref: last_message_id,
   last_messages_count: messagesCountValues.length 
  } : { 
   last_messages_count: messagesCountValues.length, 
  }
  this.gohighlevelConversionRepository.update({ id: conversation_id_from_db }, payload);
 }

 /**
  * For contact
  * @param param  { mode: "save" | "update" | "delete", reference_values: string | object, update_values?: object }
  */
 async saveOrUpdateContact({ mode, reference_values, update_values = {} }: { mode: "save" | "update" | "delete", reference_values: string | object, update_values?: object }) {
  console.log("repo saveOrUpdateContact", mode, reference_values, update_values)

  if (mode === "update") {
   this.gohighlevelContactRepository[mode](reference_values, update_values)
  } else {
   this.gohighlevelContactRepository[mode](reference_values)
  }
 }
}