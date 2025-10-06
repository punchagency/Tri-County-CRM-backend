import { ContactType, ConversationMessageType } from './gohighlevel.types'
import { BadRequestException } from '@nestjs/common';

export class GohighlevelAdapter {
 private readonly api
 constructor(api: any) {
  this.api = api
 }

 async contactDetail(body) {
  try {
   const allowedTypes = [
    ContactType.CUSTOMER,
    ContactType.LEAD
   ]

   if (allowedTypes.includes(body.type)) {
    const contactDetails = await this.api.getContactDetail(body.id)
    return {
     ...contactDetails,
     type: ConversationMessageType.CONTACT_CREATE_OR_UPDATE
    }
   }

   return body// when the correct data comes in
  } catch (error) {
   throw new BadRequestException(`contactDetail Error: ${error.message}`);
  }
 }

 async conversationByIdParsingBody(body) {
  try {
   const allowedTypes = [
    ConversationMessageType.INBOUND,
    ConversationMessageType.OUTBOUND
   ];
 
   if (allowedTypes.includes(body.type) && body?.contactId) { 
    return body// when the correct data comes in
   }

   const conversionDetails = await this.api.getConversationDetailByContactId(body.id)
   return {
    ...conversionDetails,
    conversationId: conversionDetails.id,
    type: ConversationMessageType.INBOUND
   }
  } catch (error) {
   throw new BadRequestException(`conversionById Error: ${error.message}`);
  }

 }

}