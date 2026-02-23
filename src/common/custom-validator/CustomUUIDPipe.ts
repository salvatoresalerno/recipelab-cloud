
import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { CustomValidationException } from '../custom-exception/CustomValidationException';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CustomUUIDPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isUUID(value)) {
      throw new CustomValidationException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Errore di validazione del parametro ' + value,
        code: 'AV1100',
        error: [
          {
            field: metadata.data, // nome del parametro (es: 'id')
            errors: ['Formato UUID non valido'],
          },
        ],
      });
    }

    return value;
  }
}




