import { ConfigService } from '@nestjs/config';
import { getSecurityConfig, SecurityConfig } from './security.config';
import { getAuthConfig, AuthConfig } from './auth.config';
import { getDatabaseConfig, DatabaseConfig } from './database.config';
import { getApiConfig, ApiConfig } from './api.config';

export interface AppConfig {
  security: SecurityConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  api: ApiConfig;
  app: {
    port: number;
    environment: string;
    version: string;
  };
}

export const getAppConfig = (configService: ConfigService): AppConfig => ({
  security: getSecurityConfig(configService),
  auth: getAuthConfig(configService),
  database: getDatabaseConfig(configService),
  api: getApiConfig(configService),
  app: {
    port: parseInt(configService.get<string>('PORT') || '3005', 10),
    environment: configService.get<string>('NODE_ENV') || 'development',
    version: configService.get<string>('APP_VERSION') || '1.0.0',
  },
});

export * from './security.config';
export * from './auth.config';
export * from './database.config';
export * from './api.config';
