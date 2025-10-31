import { Injectable, Logger } from '@nestjs/common';
import { SquareCustomerService } from './square.customer.service';
import { SquareInvoiceService } from './square.invoice.service';
import { SquarePaymentService } from './square.payment.service';
import { Request } from 'express';
import { MailService, TemplateName } from '@src/mail/mail.service';

@Injectable()
export class SquareService {
  private logger = new Logger(SquareService.name)
  constructor(
    private sqaureCustomerService: SquareCustomerService,
    private sqaureInvoceService: SquareInvoiceService,
    private sqaurePaymentService: SquarePaymentService,
    private mailService: MailService
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

  testEmail(){
    const dispatedResponse = this.mailService.dispatch({
      subject: "Your Invoice - QuantuumImpact",
      // receipentEmailLocationInTemplateInput: 'primary_recipient.email_address',
      // templateInput: {
      //   "id": "inv:0-ChCHu2mZEabLeeHahQnXDjZQECY",
      //   "version": 0,
      //   "location_id": "ES0RJRZYEC39A",
      //   "order_id": "CAISENgvlJ6jLWAzERDzjyHVybY",
      //   "payment_requests": [
      //     {
      //       "uid": "2da7964f-f3d2-4f43-81e8-5aa220bf3355",
      //       "request_type": "BALANCE",
      //       "due_date": "2030-01-24",
      //       "tipping_enabled": true,
      //       "automatic_payment_source": "NONE",
      //       "reminders": [
      //         {
      //           "uid": "beebd363-e47f-4075-8785-c235aaa7df11",
      //           "relative_scheduled_days": -1,
      //           "message": "Your invoice is due tomorrow",
      //           "status": "PENDING"
      //         }
      //       ],
      //       "computed_amount_money": {
      //         "amount": 10000,
      //         "currency": "USD"
      //       },
      //       "total_completed_amount_money": {
      //         "amount": 0,
      //         "currency": "USD"
      //       }
      //     }
      //   ],
      //   "invoice_number": "inv-100",
      //   "title": "Event Planning Services",
      //   "description": "We appreciate your business!",
      //   "delivery_method": "EMAIL",
      //   "scheduled_at": "2030-01-13T10:00:00Z",
      //   "status": "DRAFT",
      //   "timezone": "America/Los_Angeles",
      //   "created_at": "2020-06-18T17:45:13Z",
      //   "updated_at": "2020-06-18T17:45:13Z",
      //   "primary_recipient": {
      //     "customer_id": "JDKYHBWT1D4F8MFH63DBMEN8Y4",
      //     "given_name": "Amelia",
      //     "family_name": "Earhart",
      //     "email_address": "sylvester.ekweozor@gmail.com",
      //     "phone_number": "1-212-555-4240"
      //   },
      //   "accepted_payment_methods": {
      //     "card": true,
      //     "square_gift_card": false,
      //     "bank_account": false,
      //     "buy_now_pay_later": false,
      //     "cash_app_pay": false
      //   },
      //   "custom_fields": [
      //     {
      //       "label": "Event Reference Number",
      //       "value": "Ref. #1234",
      //       "placement": "ABOVE_LINE_ITEMS"
      //     },
      //     {
      //       "label": "Terms of Service",
      //       "value": "The terms of service are...",
      //       "placement": "BELOW_LINE_ITEMS"
      //     }
      //   ],
      //   "sale_or_service_date": "2030-01-24",
      //   "store_payment_method_enabled": false
      // } as any,
      // temelateName: TemplateName.SQUARE
      receipentEmailLocationInTemplateInput: 'contactDetails.email',
      templateInput: {
        "_id": "6578278e879ad2646715ba9c",
        "status": "draft",
        "liveMode": false,
        "amountPaid": 0,
        "altId": "6578278e879ad2646715ba9c",
        "altType": "location",
        "name": "New Invoice",
        "businessDetails": {
          "name": "ABC Corp.",
          "address": "9931 Beechwood, TX",
          "phoneNo": "+1-214-559-6993",
          "website": "wwww.example.com",
          "logoUrl": "https://example.com/logo.png",
          "customValues": ["string"]
        },
        "invoiceNumber": "19",
        "currency": "USD",
        "contactDetails": {
          "id": "6578278e879ad2646715ba9c",
          "phoneNo": "+1-214-559-6993",
          "email": "sylvester.ekweozor@gmail.com",
          "customFields": ["string"],
          "name": "Alex",
          "address": {
            "countryCode": "US",
            "addressLine1": "9931 Beechwood",
            "addressLine2": "Beechwood",
            "city": "St. Houston",
            "state": "TX",
            "postalCode": "559-6993"
          },
          "additionalEmails": [
            {
              "email": "alex@example.com"
            }
          ],
          "companyName": "ABC Corp."
        },
        "issueDate": "2023-01-01",
        "dueDate": "2023-01-01",
        "discount": {
          "type": "percentage",
          "value": 10
        },
        "invoiceItems": [
          {
            "taxes": [],
            "_id": "c6tZZU0rJBf30ZXx9Gli",
            "productId": "c6tZZU0rJBf30ZXx9Gli",
            "priceId": "c6tZZU0rJBf30ZXx9Gli",
            "currency": "USD",
            "name": "Macbook Pro",
            "qty": 1,
            "amount": 999
          }
        ],
        "total": 999,
        "title": "INVOICE",
        "amountDue": 999,
        "createdAt": "2023-12-12T09:27:42.355Z",
        "updatedAt": "2023-12-12T09:27:42.355Z",
        "totalSummary": {
          "subTotal": 999,
          "discount": 0
        }
      } as any,
      temelateName: TemplateName.GHL
    })

    return dispatedResponse
  }
}
