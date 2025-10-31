import { Injectable, Logger } from '@nestjs/common';
import { InvoiceEventType } from './square.types';
import { SquareRepo } from './square.repo';
import { SquareInvoice } from './entities/square.invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService, TemplateName } from '@src/mail/mail.service';

@Injectable()
export class SquareInvoiceService {
  private logger = new Logger(SquareInvoiceService.name)
  private squareRepo: SquareRepo

  constructor(
    @InjectRepository(SquareInvoice)
    private squareInvoiceRepository: Repository<SquareInvoice>,
    private mailService: MailService
  ) {
    this.squareRepo = new SquareRepo({ squareInvoiceRepository })
  }


  async onCreateInvoice(body: any) {
    if (InvoiceEventType.CREATED !== body.type) {
      return
    }

    const typeNanme = body.type.split(".").pop()
    const invoiceinformation = { ...body.data.object, type: typeNanme }

    // saving record and dispatching email to customer
    const [squareSavedData,] = await Promise.all([
      this.squareRepo.saveOrUpdateForInvoice(invoiceinformation),
      this.mailService.dispatch({
        subject:"Your Invoice - QuantuumImpact",
        receipentEmailLocationInTemplateInput: 'primary_recipient.email_address',
        templateInput: invoiceinformation,
        temelateName: TemplateName.SQUARE
      })
    ])

    return squareSavedData
    // return this.squareRepo.saveOrUpdateForInvoice(invoiceinformation)
  }

  async onPaymentMade(body: any) {
    if (InvoiceEventType.PAYMENT_MADE !== body.type) {
      return
    }

    const typeNanme = body.type.split(".").pop()
    const invoiceinformation = { ...body.data.object, type: typeNanme }
    return this.squareRepo.saveOrUpdateForInvoice(invoiceinformation)
  }

  async onRefund(body: any) {
    if (InvoiceEventType.REFUNDED !== body.type) {
      return
    }

    const typeNanme = body.type.split(".").pop()
    const invoiceinformation = { ...body.data.object, type: typeNanme }
    return this.squareRepo.saveOrUpdateForInvoice(invoiceinformation)
  }

  async onFailedCharge(body: any) {
    if (InvoiceEventType.CHARGE_FAILD !== body.type) {
      return
    }

    const typeNanme = body.type.split(".").pop()
    const invoiceinformation = { ...body.data.object, type: typeNanme }
    return this.squareRepo.saveOrUpdateForInvoice(invoiceinformation)
  }

  async invoiceHandle(body) {
    try {
      //  implemeting action parallelly because they are independent
      await Promise.all([
        this.onPaymentMade(body),
        this.onRefund(body),
        this.onFailedCharge(body)
      ])
    } catch (error) {
      this.logger.log(error)
    }
  }
}
