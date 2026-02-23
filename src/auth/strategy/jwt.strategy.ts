 
import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from 'src/common/types/commonTypes';
import { CustomException } from 'src/common/custom-exception/CustomException';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new CustomException(
        'Configurazione server errata: JWT_SECRET mancante',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal Server Error'
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,  
      issuer: configService.get<string>('ISS_JWT'),
      audience: configService.get<string>('AUD_JWT'),
    });
  }

  async validate(payload: any): Promise<CurrentUser> {
    return { 
      id: payload.sub, 
      email: payload.email, 
      username: payload.username 
    };
  }
}