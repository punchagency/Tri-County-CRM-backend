import { SquareHelper } from './square.helper';

export class SquareRepo {
 private squareCustomerRepository
 private squarePaymentRepository
 private squareInvoiceRepository

 constructor({
  squareCustomerRepository,
  squarePaymentRepository,
  squareInvoiceRepository
 }: {
  squareCustomerRepository?: any,
  squarePaymentRepository?: any,
  squareInvoiceRepository?: any,
 }) {

  this.squareCustomerRepository = squareCustomerRepository;
  this.squarePaymentRepository = squarePaymentRepository;
  this.squareInvoiceRepository = squareInvoiceRepository;
 }

 async saveOrUpdateOrDeleteForCustomer(payload, isDelete = false) {
  if (!payload) {
   return
  }
  const customer = SquareHelper.formatCustomer(payload)

  const existingCustomer = await this.squareCustomerRepository.findOneBy({
   customer_ref: customer?.customer_ref
  })

  // delete customer information
  if (existingCustomer && isDelete) {
   await this.squareCustomerRepository.delete({ customer_ref: customer?.customer_ref })
   return existingCustomer
  }

  // update customer information
  if (existingCustomer) {
   await this.squareCustomerRepository.update({ customer_ref: customer?.customer_ref }, customer)

   Object.assign(existingCustomer, customer)
   return existingCustomer
  }

  // saving new customer
  return await this.squareCustomerRepository.save(customer)
 }


 async saveOrUpdateForInvoice(payload) {
  if (!payload) {
   return
  }

  const invoice = SquareHelper.formatInvoice(payload)

  const existingInvoice = await this.squareInvoiceRepository.findOneBy({
   invoice_ref: invoice?.invoice_ref
  })

  // already existing
  if (existingInvoice) {
   await this.squareInvoiceRepository.update({ invoice_ref: invoice?.invoice_ref }, invoice)

   Object.assign(existingInvoice, invoice)
   return existingInvoice
  }


  // saving new invoice
  return await this.squareInvoiceRepository.save(invoice)
 }

 async saveOrUpdateForPayment(payload) {
  if (!payload) {
   return
  }
  const payment = SquareHelper.formatPayment(payload)
 
  const existingPayment = await this.squarePaymentRepository.findOneBy({
   payment_ref: payment?.payment_ref
  })

  // already existing
  if (existingPayment) {
   await this.squarePaymentRepository.update({ payment_ref: payment?.payment_ref }, payment)

   Object.assign(existingPayment, payment)
   return existingPayment
  }


  // saving new payment
  return await this.squarePaymentRepository.save(payment)
 }
}