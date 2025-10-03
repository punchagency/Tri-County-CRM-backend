import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { createVerify } from "crypto";

import { GohighlevelServiceHelper } from './gohighlevel.service.helper';
import { GohighlevelConversationService } from './gohighlevel.conversation.service';
import { GohighlevelContactService } from './gohighlevel.contact.service';

@Injectable()
export class GohighlevelService {
  private gohighlevelServiceHelper: GohighlevelServiceHelper;

  constructor(
    private readonly gohighlevelConversationService: GohighlevelConversationService,
    private readonly gohighlevelContactService: GohighlevelContactService,
  ) {
    this.gohighlevelServiceHelper = new GohighlevelServiceHelper();
  }

  private verifyWebhookSignature(webhookData, signature) {
    if (webhookData || signature) {
      return false
    }

    const payload = JSON.stringify(webhookData);

    const verifier = createVerify('SHA256');
    verifier.update(payload);
    verifier.end();

    return verifier.verify("publicKey", signature, 'base64');
  }

  async webhookHandler(req: Request) {
    const { body, headers } = req;
    console.log("body",body)
    console.log("headers",headers)

    // signature validation
    const signature = headers?.['x-wh-signature']
    const isValidSignature = this.verifyWebhookSignature(body, signature)

    if (isValidSignature) {
      return
    }

    // processing data
    if (body.type && this.gohighlevelServiceHelper.selectedAction(body.type)) {
      // contact handle should always come before the conversation handle based on relationship
      this.gohighlevelContactService.contactHandle(body)
      this.gohighlevelConversationService.conversationHandle(body);
    }
  }

}