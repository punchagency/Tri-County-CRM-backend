interface InvoiceItem {
 name: string;
 qty: number;
 amount: number;
 currency: string;
}

export interface GHLInvoice {
 name: string;
 title: string;
 invoiceNumber: string;
 issueDate: string;
 dueDate: string;
 currency: string;
 total: number;
 amountDue: number;
 discount: { type: string; value: number };
 businessDetails: {
  name: string;
  address: string;
  phoneNo: string;
  website: string;
  logoUrl: string;
 };
 contactDetails: {
  name: string;
  email: string;
  address: {
   addressLine1: string;
   city: string;
   state: string;
   postalCode: string;
   countryCode: string;
  };
  companyName: string;
 };
 invoiceItems: InvoiceItem[];
 totalSummary: { subTotal: number; discount: number };
}

export function generateGHLInvoiceEmailHTML(invoice: GHLInvoice): string {
 const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: invoice.currency || 'USD',
  }).format(value);

 const itemsHTML = invoice.invoiceItems
  .map(
   (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #ddd;">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;text-align:center;">${item.qty}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">${formatCurrency(item.amount)}</td>
        </tr>`
  )
  .join('');

 return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>${invoice.title || 'Invoice'}</title>
  </head>
  <body style="font-family:Arial, sans-serif;background-color:#f7f7f7;padding:20px;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:700px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
      <tr style="background:#003366;color:#fff;">
        <td style="padding:20px;">
          <img src="${invoice.businessDetails.logoUrl}" alt="logo" height="50" style="vertical-align:middle;" />
          <span style="font-size:22px;font-weight:bold;margin-left:10px;vertical-align:middle;">
            ${invoice.businessDetails.name}
          </span>
        </td>
        <td style="text-align:right;padding:20px;">
          <div style="font-size:28px;font-weight:bold;">${invoice.title}</div>
          <div style="font-size:14px;">#${invoice.invoiceNumber}</div>
        </td>
      </tr>

      <tr>
        <td colspan="2" style="padding:20px;">
          <h3>Bill To:</h3>
          <p>
            ${invoice.contactDetails.name}<br/>
            ${invoice.contactDetails.companyName}<br/>
            ${invoice.contactDetails.address.addressLine1}, ${invoice.contactDetails.address.city}, ${invoice.contactDetails.address.state} ${invoice.contactDetails.address.postalCode}<br/>
            ${invoice.contactDetails.email}
          </p>
        </td>
      </tr>

      <tr>
        <td colspan="2" style="padding:0 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:20px;">
            <thead>
              <tr style="background:#f0f0f0;">
                <th style="text-align:left;padding:10px;">Item</th>
                <th style="text-align:center;padding:10px;">Qty</th>
                <th style="text-align:right;padding:10px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </td>
      </tr>

      <tr>
        <td colspan="2" style="padding:20px;">
          <table width="100%">
            <tr>
              <td style="text-align:right;padding:5px 0;">Subtotal:</td>
              <td style="text-align:right;padding:5px 0;">${formatCurrency(invoice.totalSummary.subTotal)}</td>
            </tr>
            ${invoice.discount?.value
   ? `<tr>
                    <td style="text-align:right;padding:5px 0;">Discount (${invoice.discount.value}${invoice.discount.type === 'percentage' ? '%' : ''}):</td>
                    <td style="text-align:right;padding:5px 0;">-${invoice.discount.type === 'percentage' ? invoice.discount.value + '%' : formatCurrency(invoice.discount.value)}</td>
                   </tr>`
   : ''
  }
            <tr>
              <td style="text-align:right;padding:5px 0;font-weight:bold;">Total:</td>
              <td style="text-align:right;padding:5px 0;font-weight:bold;">${formatCurrency(invoice.total)}</td>
            </tr>
            <tr>
              <td style="text-align:right;padding:5px 0;color:#d9534f;">Amount Due:</td>
              <td style="text-align:right;padding:5px 0;color:#d9534f;">${formatCurrency(invoice.amountDue)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td colspan="2" style="padding:20px;">
          <p><strong>Issue Date:</strong> ${invoice.issueDate}</p>
          <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
        </td>
      </tr>

      <tr>
        <td colspan="2" style="background:#f0f0f0;padding:15px;text-align:center;font-size:12px;color:#555;">
          ${invoice.businessDetails.name} • ${invoice.businessDetails.address} • ${invoice.businessDetails.phoneNo}<br/>
          <a href="${invoice.businessDetails.website}" style="color:#003366;">${invoice.businessDetails.website}</a>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}
