

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CustomValidationException } from './CustomValidationException';
import { CustomErrorPayload } from './error.interface';
import { CustomException } from './CustomException';
import { ErrorApiResponseDto } from '../response-dto';
import { PrismaClientKnownRequestError } from 'src/generated/prisma/internal/prismaNamespace';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {

  constructor() {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Errore imprevisto e inatteso';
    let error = 'InternalServerError';
    let code = 'AP3000';

    


    // --- Gestione errori Prisma ---
    if (exception instanceof PrismaClientKnownRequestError) {
      statusCode = HttpStatus.BAD_REQUEST;
      error = 'PrismaClientKnownRequestError'; 

      switch (exception.code) {
        case 'P2002':
          message = 'La risorsa che stai tentando di creare è già esistente. Riprova con un valore diverso.';
          code = '3002';
          break;
        case 'P2003':
          message = 'Non è possibile completare l\'operazione. Assicurati che tutti gli elementi collegati esistano.';
          code = '3003';
          break;
        case 'P2025':
          message = 'Record non trovato o già cancellato';
          code = '3004';
          break;
        case 'P2000':
          message = 'Valore troppo lungo per il campo';
          code = '3005';
          break;
        case 'P2001':
          message = 'Nessun record trovato';
          code = '3006';
          break;
        case 'P2004':
          message = 'Si è verificato un errore di validazione interno. Verifica i dati e riprova.';
          code = '3007';
          break;
        case 'P2011':
          message = 'Il valore non può essere nullo';
          code = '3008';
          break;
        case 'P2014':
          message = 'Non è stato possibile collegare tutti gli elementi richiesti. Controlla le relazioni e riprova';
          code = '3009';
          break;
        default:  //per errori non mappati
          //message = exception.message;
          message = `Errore generico del database. Riprova più tardi.`;
          code = '3999';
      }
    }

    // --- CustomValidationException ---
    else if (exception instanceof CustomValidationException) {
      statusCode = exception.getStatus();
      const responsePayload = exception.getResponse() as CustomErrorPayload;
      message = responsePayload.message;
      code = responsePayload.code;
      error = responsePayload.error;
      console.log('errori di validazione: ', error)
    }

    // --- CustomException ---
    else if (exception instanceof CustomException) {
      //console.log('EXEPTION: ', exception)
      const responsePayload = exception.getResponse() as CustomErrorPayload;
      console.log('RESPONSE PAYLOAD: ', responsePayload)
      statusCode = responsePayload.statusCode;
      error = responsePayload.error;
      message = responsePayload.message;
      code = responsePayload.code;
    }   

    // --- HttpException standard ---
    else if (exception instanceof HttpException) {
      /* statusCode = exception.getStatus();
      error = exception.name;
      message = 'Richiesta non conforme o dati non validi.';
      code = 'AP3200'; */
      statusCode = exception.getStatus();
      error = exception.name;
      const res = exception.getResponse() as any;

      // Se res.message è un array (class-validator), lo trasformiamo in stringa leggibile
      message = Array.isArray(res.message) 
        ? res.message.join(', ') 
        : res.message || 'Richiesta non conforme';
        
      code = 'VALIDATION_ERROR';
    }  
        
    // --- Eccezioni generiche ---
    else {
      error = (exception as any)?.name ?? 'Error';
      message = (exception as any)?.message ?? message;
    }

    // --- Costruzione risposta ---
    const apiResponse: ErrorApiResponseDto = {
      success: false,
      statusCode,
      message,
      code,
      error,
      data: null,
    };

    

console.log('api response: ', apiResponse)

    // --- Risposta HTTP ---
    response.status(statusCode).json(apiResponse);
  }
}




