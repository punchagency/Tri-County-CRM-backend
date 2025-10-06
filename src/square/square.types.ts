
export enum CustomerEventType {
  CREATED = 'customer.created',
  DELETED = 'customer.deleted',
  UPDATED = 'customer.updated',
}

export enum InvoiceEventType {
  PAYMENT_MADE = "invoice.payment_made",
  CHARGE_FAILD = 'invoice.scheduled_charge_failed',
  REFUNDED = 'invoice.refunded',
  CREATED = 'invoice.created',
}

export enum PaymentEventType {
  CREATED = 'payment.created',
  UPDATED = 'payment.updated',
}