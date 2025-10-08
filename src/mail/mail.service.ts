import * as nodemailer from "nodemailer";

import { ConfigService } from '@nestjs/config';
import { AppConfig, getAppConfig } from '@src/config';
import { Injectable, Logger } from '@nestjs/common';
import { generateGHLInvoiceEmailHTML, GHLInvoice } from './templates/ghl.template';
import { generateSquareInvoiceEmailHTML, SquareInvoice } from './templates/square.template';

export enum TemplateName {
 SQUARE = "square",
 GHL = "ghl"
}

interface TemplateProps {
 templateInput?: GHLInvoice | SquareInvoice
 temelateName?: TemplateName
 /* eg. 'contactDetails.email' or 'primary_recipient.email_address' */
 receipentEmailLocationInTemplateInput?: string
}

interface SendMailProps {
 from?: string //'"Example Team" <team@example.com>', // sender address
 to?: string // "alice@example.com, bob@example.com", // list of receivers
 subject: string // "Hello", // Subject line
 text?: string // "Hello world?", // plain text body
 html?: string// "<b>Hello world?</b>", // html body
}

@Injectable()
export class MailService {
 private logger = new Logger(MailService.name)
 private mailConfig: AppConfig['api']['email']

 constructor(
  private readonly configService: ConfigService
 ) {
  const config = getAppConfig(this.configService);
  this.mailConfig = config.api.email;
 }

 private async transporter(mailInput: SendMailProps) {
  const { smtp, from } = this.mailConfig;

  const mailer = nodemailer.createTransport({
   host: smtp.host,
   port: smtp.port,
   secure: smtp.secure, // upgrade later with STARTTLS
   auth: {
    user: smtp.auth.user,
    pass: smtp.auth.pass,
   },
  });

  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return await mailer.sendMail({
   ...mailInput,
   from: mailInput?.from || from
  });
 }

 private appyCustomTemplate({ temelateName, templateInput }: TemplateProps) {
  switch (temelateName) {
   case TemplateName.GHL:
    return generateGHLInvoiceEmailHTML(templateInput as GHLInvoice);
   case TemplateName.SQUARE:
    return generateSquareInvoiceEmailHTML(templateInput as SquareInvoice);

   // TODO:  If needed more templates can be add here...

   default:
    throw new Error("No template has been selected");
    ;
  }
 }

 private extractEmailAddressFromTemplateInput({ receipentEmailLocationInTemplateInput, templateInput }: TemplateProps) {

  if (!receipentEmailLocationInTemplateInput) {
   return
  }

  // dynamically pick values of the email
  const keyLocationPathToArray = receipentEmailLocationInTemplateInput.split(".")
  let targetedValues = templateInput as any
  for (const keyName of keyLocationPathToArray) {
   if (keyName) {
    targetedValues = targetedValues[keyName];
   }
  }

  // returns the target email as the reciepent email address
  // return targetedValues as string
  return 'sylvester.ekweozor@gmail.com'//TOOD: Remove afovetesting 

 }

 

 /**
  * Handles dispatch of email 
  * Eg. for custom input with template
  *  subject:"Your Invoice - QuantuumImpact",
     receipentEmailLocationInTemplateInput: 'primary_recipient.email_address',
     templateInput: invoiceinformation,
     temelateName: TemplateName.SQUARE
  * @param params SendMailProps & TemplateProps
  * @returns Promise<{ messageId, ...rest }>
  */
 async dispatch({ templateInput, temelateName, receipentEmailLocationInTemplateInput, ...rest }: SendMailProps & TemplateProps) {
  try {
   const selectedHTMLTemplate = this.appyCustomTemplate({ 
    templateInput, 
    temelateName 
   });

   const receipent = this.extractEmailAddressFromTemplateInput({ 
    receipentEmailLocationInTemplateInput, 
    templateInput 
   })

   return await this.transporter({ 
    ...rest, 
    to: rest.to || receipent, 
    html: rest.html || selectedHTMLTemplate 
   });
  } catch (err) {
   this.logger.error(err);
  }
 }

}