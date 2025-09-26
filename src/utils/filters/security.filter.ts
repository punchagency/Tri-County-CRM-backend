import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class SecurityExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SecurityExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || exception.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // Log security-related errors
    if (status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN) {
      this.logger.warn(
        `Security Event: ${error} - ${message} - IP: ${request.ip} - User-Agent: ${request.get('User-Agent')} - URL: ${request.url}`,
      );
    } else if (status >= 500) {
      this.logger.error(
        `Server Error: ${error} - ${message} - IP: ${request.ip} - URL: ${request.url}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    // Don't expose sensitive error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: error,
      message: isDevelopment ? message : this.getSafeErrorMessage(status, message),
    };

    // Add stack trace in development
    if (isDevelopment && exception instanceof Error) {
      (errorResponse as any).stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

  private getSafeErrorMessage(status: number, message: string): string {
    // Return safe error messages for production
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return 'Authentication required';
      case HttpStatus.FORBIDDEN:
        return 'Access denied';
      case HttpStatus.NOT_FOUND:
        return 'Resource not found';
      case HttpStatus.BAD_REQUEST:
        return 'Invalid request';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'An internal error occurred';
      default:
        return 'An error occurred';
    }
  }
}
