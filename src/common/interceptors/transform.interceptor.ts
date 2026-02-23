import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data.message || 'Operazione completata con successo',
        data: data?.result !== undefined ? data.result : data,  //data.result || data, // Se passi un oggetto con 'result', usa quello, altrimenti tutto l'oggetto
        code: 'OK',
        error: null
      })),
    );
  }
}