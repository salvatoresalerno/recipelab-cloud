

 
import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomErrorPayload } from './error.interface';



export class CustomValidationException extends HttpException {
  constructor(payload: CustomErrorPayload) {
    super(payload, payload.statusCode ?? HttpStatus.UNPROCESSABLE_ENTITY);
  }
}


