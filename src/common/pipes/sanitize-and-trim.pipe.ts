


import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { filterXSS } from 'xss';
import { CustomValidationException } from '../custom-exception/CustomValidationException';

@Injectable()
export class SanitizeAndTrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value == null) return value;

    if (typeof value === 'string') {
      return this.cleanString(value, metadata.data || 'params');
    }

    if (typeof value === 'object') {
      return this.sanitizeAndTrim(value);
    }

    return value;
  }

  private sanitizeAndTrim(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeAndTrim(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const sanitizedObj: any = {};
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        sanitizedObj[key] =
          typeof val === 'string' ? this.cleanString(val, key) :
          typeof val === 'object' && val !== null ? this.sanitizeAndTrim(val) :
          val;
      }
      return sanitizedObj;
    }

    return obj;
  }

  private cleanString(value: string, fieldName: string): string {
    if (!value) return value;

    let result = value.trim();

    const containsScript = /<script[\s>]|<\/script>/i.test(result);

    // ✅ solo protezione XSS
    result = filterXSS(result, {
      whiteList: {}, // nessun tag permesso
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script'],
    });

    if ((!result || result === '[removed]') && containsScript) {
      throw new CustomValidationException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Input non valido',
        code: 'AV1110',
        error: [{
          field: fieldName,
          errors: ['Il campo contiene codice non consentito']
        }]
      });
    }

    return result;
  }
}










/* 
 questa versione introduce escape di ' non voluti

import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import {filterXSS}  from 'xss';
import { CustomValidationException } from '../custom-exception/CustomValidationException';

@Injectable()
export class SanitizeAndTrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
     
    if (typeof value === 'string') {
        return this.cleanString(value, metadata.data || 'params');
    }

    if (typeof value === 'object' && value !== null) {
        return this.sanitizeAndTrim(value);
    }
 
    return value;
  }

  private sanitizeAndTrim(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeAndTrim(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const sanitizedObj: any = {};
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        sanitizedObj[key] =
          typeof val === 'string' ? this.cleanString(val, key) :
          typeof val === 'object' && val !== null ? this.sanitizeAndTrim(val) :
          val;
      }
      return sanitizedObj;
    }

    return obj;
  }

  private cleanString(value: string, fieldName: string): string {
    if (!value) {
      return value;
    }

    // Trim prima
    let result = value.trim();    

    // Verifica se contiene codice script anche dopo la sanitizzazione
    const containsScript = /<script[\s>]|<\/script>/i.test(result);

    // Sanitizza SQL-like
    result = result
      .replace(/'/g, "''")     // Escape singolo apice
      .replace(/;/g, '')       // Rimuove punto e virgola
      .replace(/--/g, '')      // Rimuove commenti SQL
      .replace(/"/g, '')       // Rimuove doppi apici
      .replace(/\\/g, '');     // Rimuove backslash

    // Sanitizza XSS
    result = filterXSS (result, {
      whiteList: {}, // Non permettere NESSUN tag HTML
      stripIgnoreTag: true, // Rimuove tutti i tag ignorati
      stripIgnoreTagBody: ['script'], // Rimuove anche <script> e il contenuto      
    });

    if ((!result || result === '[removed]') && containsScript) {
        throw new CustomValidationException({
            statusCode:  HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Input non valido',
            code: 'AV1110',
            error: [{
                field: fieldName,
                errors: ['Il campo contiene codice non consentito']
            }]
        });
    }

    return result;
  }
} */







