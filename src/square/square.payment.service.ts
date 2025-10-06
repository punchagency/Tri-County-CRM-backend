import { Injectable, Logger } from '@nestjs/common';
import { PaymentEventType } from './square.types';
import { SquarePayment } from './entities/square.payment.entity';
import { SquareRepo } from './square.repo';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SquarePaymentService {
  private logger = new Logger(SquarePaymentService.name)
  private squareRepo: SquareRepo

  constructor(
    @InjectRepository(SquarePayment)
    private squarePaymentRepository: Repository<SquarePayment>
  ) {
    this.squareRepo = new SquareRepo({ squarePaymentRepository })
  }

  async onCreatePayment(body: any) {
    if (PaymentEventType.CREATED !== body.type) {
      return
    }

    const typeNanme = body.type.split(".").pop()
    const paymentInformation = { ...body.data.object, type: typeNanme }
    return this.squareRepo.saveOrUpdateForPayment(paymentInformation)
  }

  async onUpdatePayment(body: any) {
    if (PaymentEventType.UPDATED !== body.type) {
      return
    }

    const typeNanme = body.type.split(".").pop()
    const paymentInformation = { ...body.data.object, type: typeNanme }
    return this.squareRepo.saveOrUpdateForPayment(paymentInformation)
  }

  async paymentHandle(body) {
    try {
      //  implemeting action parallelly because they are independent
      await Promise.all([
        this.onCreatePayment(body),
        this.onUpdatePayment(body)
      ])
    } catch (error) {
      this.logger.log(error)
    }
  }
}
