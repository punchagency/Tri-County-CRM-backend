import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { HelmetOptions } from 'helmet';

export interface SecurityConfig {
  jwt: JwtModuleOptions;
  jwt_refresh: JwtModuleOptions;
  throttler: ThrottlerModuleOptions;
  helmet: HelmetOptions;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  bcrypt: {
    rounds: number;
  };
}

export const getSecurityConfig = (configService: ConfigService): SecurityConfig => ({
  jwt: {
    global: true,
    secret: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-change-in-production',
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
      algorithm: 'HS256',
    },
    verifyOptions: {
      algorithms: ['HS256'],
    },
  },
  jwt_refresh : {
    secret: configService.get<string>('JWT_REFRESH_SECRET') || 'your-super-secret-jwt-refresh-key-change-in-production',
    signOptions: {
      expiresIn: configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      algorithm: 'HS256',
    },
    verifyOptions: {
      algorithms: ['HS256'],
    },
  },
  throttler: {
    ttl: parseInt(configService.get<string>('THROTTLE_TTL') || '60', 10),
    limit: parseInt(configService.get<string>('THROTTLE_LIMIT') || '10', 10),
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },
  cors: {
    origin: configService.get<string>('CORS_ORIGIN')?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  bcrypt: {
    rounds: parseInt(configService.get<string>('BCRYPT_ROUNDS') || '12', 10),
  },
});
