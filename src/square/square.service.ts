import { Injectable, Logger } from '@nestjs/common';
import { SquareCustomerService } from './square.customer.service';
import { SquareInvoiceService } from './square.invoice.service';
import { SquarePaymentService } from './square.payment.service';
import { Request } from 'express';

@Injectable()
export class SquareService {
  private logger = new Logger(SquareService.name)
  constructor(
    private sqaureCustomerService: SquareCustomerService,
    private sqaureInvoceService: SquareInvoiceService,
    private sqaurePaymentService: SquarePaymentService,
  ){

  }

  async webhookHandler(req: Request) {
    this.logger.log('📦 Received Square Webhook: '+ req?.body?.type);

    if (!req?.body) {
      return
    }

    // implemeting handles parallelly because they are independent
    await Promise.all([
      this.sqaureCustomerService.customerHandle(req?.body),
      this.sqaureInvoceService.invoiceHandle(req?.body),
      this.sqaurePaymentService.paymentHandle(req?.body)
    ])
  }
}
