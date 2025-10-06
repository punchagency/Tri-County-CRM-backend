
export class SquareHelper {

 private static filterEmptyValues<T>(payload: T) {
  return Object.entries(payload).reduce((acc, [k, v]) => {
   if (v) {
    return {
     ...acc,
     [k]: v
    }
   }
   return acc
  }, {}) as T
 }

 private static dateUpdate(value) {
  if (value?.created_at && value?.updated_at) {
   return {
    created_at: new Date(value?.created_at),
    updated_at: new Date(value?.updated_at)
   }
  }

  return {
   created_at: new Date(),
   updated_at: new Date()
  }
 }

 static formatCustomer(data) {
  const customer = data?.customer
  const { created_at, updated_at } = this.dateUpdate(customer)

  const payload = {
   customer_ref: customer?.id,
   first_name: customer?.given_name,
   last_name: customer?.family_name,
   email: customer?.email_address,
   phone: customer?.phone_number,
   date_of_birth: customer?.birthday,
   additional_info: {
    address: customer?.address,
    preferences: customer?.preferences,
    version: customer?.version,
    group_id: customer?.group_ids
   },
   created_at,
   updated_at

  }

  return this.filterEmptyValues(payload)

 }

 static formatInvoice(data) {
  const invoice = data?.invoice;
  const type = data?.type
  const { created_at, updated_at } = this.dateUpdate(invoice)

  const payload = {
   type,
   invoice_ref: invoice?.id,
   accepted_payment_methods: invoice?.accepted_payment_methods,
   custom_fields: invoice?.custom_fields,
   delivery_method: invoice?.delivery_method,
   description: invoice?.description,
   invoice_number: invoice?.invoice_number,
   location_id: invoice?.location_id,
   order_id: invoice?.order_id,
   payment_requests: invoice?.payment_requests,
   primary_recipient: invoice?.primary_recipient,
   sale_or_service_date: invoice?.sale_or_service_date,
   status: invoice?.status,
   store_payment_method_enabled: invoice?.store_payment_method_enabled,
   timezone: invoice?.timezone,
   title: invoice?.title,
   version: invoice?.version,
   updated_at,
   created_at,
  }

  console.log("invoice?.store_payment_method_enabled", typeof invoice?.store_payment_method_enabled)

  return this.filterEmptyValues(payload)
 }

 static formatPayment(data) {
  const payment = data?.payment;
  const type = data?.type
  const { created_at, updated_at } = this.dateUpdate(payment)

  const payload = {
   type,
   payment_ref: payment?.id,
   amount_money: payment?.amount_money,
   approved_money: payment?.approved_money,
   capabilities: payment?.capabilities,
   card_details: payment?.card_details,
   delay_action: payment?.delay_action,
   delay_duration: payment?.delay_duration,
   delayed_until: payment?.delayed_until,
   location_id: payment?.location_id,
   order_id: payment?.order_id,
   receipt_number: payment?.receipt_number,
   risk_evaluation: payment?.risk_evaluation,
   source_type: payment?.source_type,
   status: payment?.status,
   total_money: payment?.total_money,
   version_token: payment?.version_token,
   updated_at,
   created_at,

  }

  return this.filterEmptyValues(payload)
 }
}