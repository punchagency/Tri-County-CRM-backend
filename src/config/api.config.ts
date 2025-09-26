import { ConfigService } from '@nestjs/config';

export interface ApiConfig {
  gohighlevel: {
    apiKey: string;
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  pos: {
    square: {
      applicationId: string;
      accessToken: string;
      environment: 'sandbox' | 'production';
      webhookSignatureKey: string;
    };
  };
  scraping: {
    userAgent: string;
    timeout: number;
    retryAttempts: number;
    delayBetweenRequests: number;
  };
  email: {
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: string;
  };
}

export const getApiConfig = (configService: ConfigService): ApiConfig => ({
  gohighlevel: {
    apiKey: configService.get<string>('GOHIGHLEVEL_API_KEY') || '',
    baseUrl: configService.get<string>('GOHIGHLEVEL_BASE_URL') || 'https://rest.gohighlevel.com/v1',
    timeout: parseInt(configService.get<string>('GOHIGHLEVEL_TIMEOUT') || '30000', 10),
    retryAttempts: parseInt(configService.get<string>('GOHIGHLEVEL_RETRY_ATTEMPTS') || '3', 10),
    retryDelay: parseInt(configService.get<string>('GOHIGHLEVEL_RETRY_DELAY') || '1000', 10),
  },
  pos: {
    square: {
      applicationId: configService.get<string>('SQUARE_APPLICATION_ID') || '',
      accessToken: configService.get<string>('SQUARE_ACCESS_TOKEN') || '',
      environment: (configService.get<string>('SQUARE_ENVIRONMENT') || 'sandbox') as 'sandbox' | 'production',
      webhookSignatureKey: configService.get<string>('SQUARE_WEBHOOK_SIGNATURE_KEY') || '',
    },
  },
  scraping: {
    userAgent: configService.get<string>('SCRAPING_USER_AGENT') || 'Tri-County-CRM/1.0',
    timeout: parseInt(configService.get<string>('SCRAPING_TIMEOUT') || '10000', 10),
    retryAttempts: parseInt(configService.get<string>('SCRAPING_RETRY_ATTEMPTS') || '3', 10),
    delayBetweenRequests: parseInt(configService.get<string>('SCRAPING_DELAY') || '1000', 10),
  },
  email: {
    smtp: {
      host: configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: parseInt(configService.get<string>('SMTP_PORT') || '587', 10),
      secure: configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: configService.get<string>('SMTP_USER') || '',
        pass: configService.get<string>('SMTP_PASS') || '',
      },
    },
    from: configService.get<string>('EMAIL_FROM') || 'noreply@tricounty.com',
  },
});
