import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DatabaseConfig {
  typeorm: TypeOrmModuleOptions;
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
}

export const getDatabaseConfig = (configService: ConfigService): DatabaseConfig => ({
  typeorm: {
    type: 'postgres',
    host: configService.get<string>('DB_HOST') || 'localhost',
    port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
    username: configService.get<string>('DB_USERNAME') || 'root',
    password: configService.get<string>('DB_PASSWORD') || 'root',
    database: configService.get<string>('DB_NAME') || 'tri_county_crm',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<string>('NODE_ENV') !== 'production',
    // logging: configService.get<string>('NODE_ENV') === 'development',
    logging:false,
    ssl: configService.get<string>('NODE_ENV') === 'production' ? {
      rejectUnauthorized: false,
    } : false,
    extra: {
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  },
  redis: {
    host: configService.get<string>('REDIS_HOST') || 'localhost',
    port: parseInt(configService.get<string>('REDIS_PORT') || '6379', 10),
    password: configService.get<string>('REDIS_PASSWORD'),
    db: parseInt(configService.get<string>('REDIS_DB') || '0', 10),
  },
});
