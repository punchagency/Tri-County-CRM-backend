import { BadRequestException, Logger } from '@nestjs/common';

import { ApiConfig } from '@src/config';
import { makeCallWithAxios } from '@src/utils/client/makeCallWithAxios';

import { Contact } from './gohighlevel.types';
import { GohighlevelServiceApi } from './gohighlevel.api';


export class Contacts {
 private static gohighlevel: ApiConfig['gohighlevel'];

 constructor({ gohighlevel }: { gohighlevel: ApiConfig['gohighlevel'] }) {
  Contacts.gohighlevel = gohighlevel;
 }

 async getContactDetail(contactId: string): Promise<Contact> {
  try {
   const api = GohighlevelServiceApi.api({ gohighlevel: Contacts.gohighlevel, contactId });

   const response = await makeCallWithAxios(api.single_contact_request_detail);

   return response.data?.contact as Contact;
  } catch (error) {
   throw new BadRequestException(`getConversationDetail Error: ${error.message}`);
  }
 }
}