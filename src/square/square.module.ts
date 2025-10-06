import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SquareController } from './square.controller';
import { SquareService } from './square.service';
import { SquareCustomer } from './entities/square.customer.entity';
import { SquareInvoice } from './entities/square.invoice.entity';
import { SquarePayment } from './entities/square.payment.entity';
import { SquareCustomerService } from './square.customer.service';
import { SquareInvoiceService } from './square.invoice.service';
import { SquarePaymentService } from './square.payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    SquareCustomer,
    SquareInvoice,
    SquarePayment
  ])],
  controllers: [SquareController],
  providers: [
    SquareService, 
    SquareCustomerService,
    SquareInvoiceService,
    SquarePaymentService
  ],
})
export class SquareModule { }
