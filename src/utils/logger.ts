import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Logger implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor(private configService: ConfigService) {
    this.logger = winston.createLogger({
      level: this.configService.get<string>('LOG_LEVEL') || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
          let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
          
          if (stack) {
            logMessage += `\n${stack}`;
          }
          
          if (Object.keys(meta).length > 0) {
            logMessage += `\n${JSON.stringify(meta, null, 2)}`;
          }
          
          return logMessage;
        })
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  /**
   * Log security-related events
   */
  logSecurityEvent(event: string, details: any, context?: string) {
    this.logger.warn(`SECURITY EVENT: ${event}`, {
      context: context || 'Security',
      event,
      details: this.sanitizeLogData(details),
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log API requests with sensitive data sanitized
   */
  logApiRequest(method: string, url: string, headers: any, body?: any, context?: string) {
    this.logger.info('API Request', {
      context: context || 'API',
      method,
      url,
      headers: this.sanitizeHeaders(headers),
      body: this.sanitizeLogData(body),
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Sanitize sensitive data from logs
   */
  private sanitizeLogData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
      'session',
      'apiKey',
      'accessToken',
      'refreshToken',
    ];

    const sanitized = { ...data };

    for (const key of sensitiveKeys) {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Sanitize headers for logging
   */
  private sanitizeHeaders(headers: any): any {
    if (!headers || typeof headers !== 'object') {
      return headers;
    }

    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
