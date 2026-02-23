// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; 
import { CustomException } from 'src/common/custom-exception/CustomException';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  
  // Gestisce cosa succede se l'utente non è autenticato o il token è invalido
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new CustomException(
        'Accesso negato: Token non valido o mancante',
        HttpStatus.UNAUTHORIZED,
        'Unauthorized'
      );
    }
    return user;
  }
}