// src/common/exceptions/custom.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error: string = 'Custom Error',
    code: string = 'AS0000',
    details?: any
  ) {
    super(
      {
        message,
        statusCode,
        error,
        code,
        timestamp: new Date().toISOString(),
        ...(details && { details }), // Aggiunge dettagli solo se presenti
      },
      statusCode
    );
  }
}