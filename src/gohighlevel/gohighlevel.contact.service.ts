import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConversationMessageType } from './gohighlevel.types';
import { GohighlevelContact } from './entities/gohighlevel.contact.entity';

@Injectable()
export class GohighlevelContactService {
  constructor(
    @InjectRepository(GohighlevelContact)
    private readonly gohighlevelContactRepository: Repository<GohighlevelContact>,
  ) {}

  private async saveContact({ mode, reference_values, update_values = {} }: { mode: "save" | "update" | "delete", reference_values: string | object, update_values?: object }) {

    if (mode === "update") {
      this.gohighlevelContactRepository[mode](reference_values, update_values)
    } else {
      this.gohighlevelContactRepository[mode](reference_values)
    }
  }

  private async getContactActionTag(body: any) {
    // checks for operations
    const contactExist = await this.gohighlevelContactRepository.findOneBy({ contact_ref: body.id });
    const isNewContact = !contactExist && body.type === ConversationMessageType.CONTACT_CREATE
    const isContactForUpdate = [
      ConversationMessageType.CONTACT_DND_UPDATE,
      ConversationMessageType.CONTACT_TAG_UPDATE
    ].includes(body.type);
    const isContactForDelete = body.type === ConversationMessageType.CONTACT_DELETE

    const tag = isNewContact ? "save" : isContactForUpdate ? "update" : isContactForDelete ? "delete" : '';

    return {
      contact: contactExist,
      tag
    }
  }

  private getContactPayload(body: any, previous_values: GohighlevelContact) {
    const existingValues = previous_values?.details || {}

    // selected action payload
    return {
      save: {
        mode: "save",
        reference_values: {
          contact_ref: body.id,
          email: body.email,
          first_name: body.firstName,
          last_name: body.lastName,
          phone: body.phone,
          details: body
        }
      },
      update: {
        mode: "update",
        reference_values: {
          contact_ref: body.id
        },
        update_values: {
          details: { ...existingValues, ...body },
          updated_at: new Date()
        }
      },
      delete: {
        mode: "delete",
        reference_values: {
          contact_ref: body.id
        }
      }
    }
  }

  async contactHandle(body: any) {
    try {
      const allowedTypes = [
        ConversationMessageType.CONTACT_CREATE,
        ConversationMessageType.CONTACT_DELETE,
        ConversationMessageType.CONTACT_DND_UPDATE,
        ConversationMessageType.CONTACT_TAG_UPDATE,
      ];

      if (!allowedTypes.includes(body.type)) {
        return;
      }

      //pre-payload posting
      const { contact, tag } = await this.getContactActionTag(body);
      const selectedPayload = this.getContactPayload(body, contact);
      const payload = selectedPayload[tag];

      payload && this.saveContact(payload)
    } catch (error) {
      throw new BadRequestException(error.message);
    }

  }

}