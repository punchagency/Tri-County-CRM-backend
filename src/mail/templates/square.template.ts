export interface SquareInvoice {
 id: string;
 title: string;
 description?: string;
 invoice_number: string;
 status: string;
 created_at: string;
 updated_at: string;
 sale_or_service_date?: string;
 scheduled_at?: string;
 timezone?: string;
 primary_recipient: {
  given_name: string;
  family_name: string;
  email_address: string;
  phone_number?: string;
 };
 payment_requests: {
  due_date: string;
  computed_amount_money: { amount: number; currency: string };
 }[];
 accepted_payment_methods: {
  card: boolean;
  square_gift_card: boolean;
  bank_account: boolean;
  buy_now_pay_later: boolean;
  cash_app_pay: boolean;
 };
 custom_fields?: { label: string; value: string; placement: string }[];
}

export function generateSquareInvoiceEmailHTML(invoice: SquareInvoice): string {
 const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency,
  }).format(amount / 100); // Square sends amount in cents

 const payment = invoice.payment_requests?.[0];
 const totalAmount = formatCurrency(
  payment.computed_amount_money.amount,
  payment.computed_amount_money.currency
 );

 const aboveFields =
  invoice.custom_fields
   ?.filter((f) => f.placement === 'ABOVE_LINE_ITEMS')
   .map(
    (f) =>
     `<tr><td style="padding:5px 0;"><strong>${f.label}:</strong> ${f.value}</td></tr>`
   )
   .join('') || '';

 const belowFields =
  invoice.custom_fields
   ?.filter((f) => f.placement === 'BELOW_LINE_ITEMS')
   .map(
    (f) =>
     `<tr><td style="padding:5px 0;"><strong>${f.label}:</strong> ${f.value}</td></tr>`
   )
   .join('') || '';

 const paymentMethods = Object.entries(invoice.accepted_payment_methods)
  .filter(([_, value]) => value)
  .map(([method]) => method.replace(/_/g, ' '))
  .join(', ') || 'None';

 return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>${invoice.title}</title>
  </head>
  <body style="font-family:Arial, sans-serif;background:#f6f6f6;margin:0;padding:20px;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:700px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <tr style="background:#004aad;color:#fff;">
        <td style="padding:20px;">
          <h1 style="margin:0;font-size:22px;">${invoice.title}</h1>
          <div style="font-size:14px;">Invoice #: ${invoice.invoice_number}</div>
          <!-- <div style="font-size:13px;">Status: ${invoice.status}</div> -->
        </td>
        <td style="text-align:right;padding:20px;font-size:14px;">
          <div>Created: ${new Date(invoice.created_at).toLocaleDateString()}</div>
          <div>Due: ${new Date(payment.due_date).toLocaleDateString()}</div>
        </td>
      </tr>

      <!-- Recipient -->
      <tr>
        <td colspan="2" style="padding:20px;">
          <h3>Bill To:</h3>
          <p style="margin:0 0 10px 0;">
            ${invoice.primary_recipient.given_name} ${invoice.primary_recipient.family_name}<br/>
            ${invoice.primary_recipient.email_address}<br/>
            ${invoice.primary_recipient.phone_number || ''}
          </p>
        </td>
      </tr>

      <!-- Above Custom Fields -->
      ${aboveFields ? `<tr><td colspan="2" style="padding:0 20px;">${aboveFields}</td></tr>` : ''}

      <!-- Invoice Description -->
      <tr>
        <td colspan="2" style="padding:20px;">
          <p style="margin:0;font-size:15px;">${invoice.description || ''}</p>
        </td>
      </tr>

      <!-- Invoice Total -->
      <tr>
        <td colspan="2" style="padding:20px;">
          <table width="100%" style="border-collapse:collapse;">
            <tr style="background:#f0f0f0;">
              <th style="text-align:left;padding:10px;">Description</th>
              <th style="text-align:right;padding:10px;">Amount</th>
            </tr>
            <tr>
              <td style="padding:10px;">${invoice.title}</td>
              <td style="padding:10px;text-align:right;font-weight:bold;">${totalAmount}</td>
            </tr>
            <tr>
              <td style="padding:10px;text-align:right;font-weight:bold;">Total Due:</td>
              <td style="padding:10px;text-align:right;font-weight:bold;color:#d9534f;">${totalAmount}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Payment Info -->
      <tr>
        <td colspan="2" style="padding:20px;">
          <h4>Accepted Payment Methods:</h4>
          <p style="margin:0 0 15px 0;">${paymentMethods}</p>
          <p><strong>Due Date:</strong> ${new Date(payment.due_date).toLocaleDateString()} (${invoice.timezone || 'Local'})</p>
        </td>
      </tr>

      <!-- Below Custom Fields -->
      ${belowFields ? `<tr><td colspan="2" style="padding:0 20px;">${belowFields}</td></tr>` : ''}

      <!-- Footer -->
      <tr>
        <td colspan="2" style="background:#004aad;color:#fff;text-align:center;padding:15px;font-size:13px;">
          <p style="margin:0;">Thank you for your business!</p>
          <p style="margin:0;">This invoice was generated by Square • ${new Date().getFullYear()}</p>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}
