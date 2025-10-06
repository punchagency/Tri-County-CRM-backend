import { ConfigService } from '@nestjs/config';

export interface ApiConfig {
  s3: {
    region: string;
    access_key: string;
    secret_key: string;
  },
  gohighlevel: {
    token: string;
    baseUrl: string;
    location_id: string;
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
  s3: {
    region: configService.get<string>('S3_REGION') || '',
    access_key: configService.get<string>('S3_ACCESS_KEY') || '',
    secret_key: configService.get<string>('S3_SECRET_KEY') || '',
  },
  gohighlevel: {
    token: configService.get<string>('GOHIGHLEVEL_PRIVATE_TOKEN') || '',
    baseUrl: configService.get<string>('GOHIGHLEVEL_BASE_URL') || '',
    location_id: configService.get<string>('GOHIGHLEVEL_LOCATION_ID') || '',
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
