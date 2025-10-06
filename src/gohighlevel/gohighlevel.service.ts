import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { createVerify } from "crypto";

import { GohighlevelServiceHelper } from './gohighlevel.service.helper';
import { GohighlevelConversationService } from './gohighlevel.conversation.service';
import { GohighlevelContactService } from './gohighlevel.contact.service';
import { EncrytDecrypt } from '@src/utils/encryt-decrypt';
import { ApiConfig, getApiConfig } from '@src/config/api.config';
import { ConfigService } from '@nestjs/config';
import { GohighlevelAdapter } from './gohighlevel.adapter';
import { Contacts } from './gohighlevel.contact';
import { Conversations } from './gohighlevel.conversation';

@Injectable()
export class GohighlevelService {
  private logger = new Logger(GohighlevelService.name)
  private gohighlevelServiceHelper: GohighlevelServiceHelper;
  private apiConfig: ApiConfig;
  private contactApi: Contacts;
  private conversationApi: Conversations;

  constructor(
    private readonly gohighlevelConversationService: GohighlevelConversationService,
    private readonly gohighlevelContactService: GohighlevelContactService,
    private readonly configService: ConfigService,
  ) {
    this.gohighlevelServiceHelper = new GohighlevelServiceHelper();
    this.apiConfig = getApiConfig(this.configService);
    this.contactApi = new Contacts({ gohighlevel: this.apiConfig.gohighlevel });
    this.conversationApi = new Conversations({ gohighlevel: this.apiConfig.gohighlevel });
  }

  private verifyWebhookSignature(webhookData, signature) {
    if (webhookData || signature) {
      return false
    }

    const payload = JSON.stringify(webhookData);

    const verifier = createVerify('SHA256');
    verifier.update(payload);
    verifier.end();

    return verifier.verify("<publicKey>", signature, 'base64');
  }

  private webhookSignatureHandler(req: Request) {
    const { headers, body } = req;
    if (!headers) {
      return false
    }

    if (headers?.['x-wh-signature']) {
      const signature = headers?.['x-wh-signature'] as string
      return this.verifyWebhookSignature(body, signature)

    } else if (headers?.['c-signature']) {
      const customSignature = headers?.['c-signature'] as string
      const token = this.apiConfig.gohighlevel.token
      return EncrytDecrypt.customVerifyToken(customSignature, token)
    } else {

      return false
    }

  }


  async webhookHandler(req: Request) {
    this.logger.log('📦 Received gohighlevel Webhook: ' + req?.body?.type);

    // signature validation
    const isValidSignature = this.webhookSignatureHandler(req)
    if (!isValidSignature || !this.gohighlevelServiceHelper.selectedAction(req.body.type)) {
      return
    }

    // contact handle should always come before the conversation handle based on relationship
    const adapterForContact = new GohighlevelAdapter(this.contactApi)
    const conactPayload = await adapterForContact.contactDetail(req.body)
    await this.gohighlevelContactService.contactHandle(conactPayload)

    // handling conversationns and messages
    const adapterForConversation = new GohighlevelAdapter(this.conversationApi)
    const conversionPayload = await adapterForConversation.conversationByIdParsingBody(conactPayload)
    this.gohighlevelConversationService.conversationAndMessageHandle(conversionPayload);

  }

}