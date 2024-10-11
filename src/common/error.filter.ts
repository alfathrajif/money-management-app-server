import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(HttpException, ZodError, UnauthorizedException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof UnauthorizedException) {
      response.status(exception.getStatus()).json({
        errors: exception.message,
        timestamp: new Date().toISOString(),
        status_code: exception.getStatus(),
      });
    } else if (exception instanceof ZodError) {
      const uniqueErrors = new Set();
      const filteredErrors = exception.issues.filter((issue) => {
        if (!uniqueErrors.has(issue.path[0])) {
          uniqueErrors.add(issue.path[0]);
          return true;
        }
        return false;
      });

      const errors = filteredErrors.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {});

      response.status(400).json({
        message: 'Bad request',
        errors: errors,
        timestamp: new Date().toISOString(),
        status_code: HttpStatus.BAD_REQUEST,
      });
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.message,
        timestamp: new Date().toISOString(),
        status_code: exception.getStatus(),
      });
    } else {
      response.status(500).json({
        message: 'Internal server error',
        errors: exception.message,
        timestamp: new Date().toISOString(),
        status_code: 500,
      });
    }
  }
}
