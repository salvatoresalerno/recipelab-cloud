import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CustomException } from 'src/common/custom-exception/CustomException';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  


  async signup(email: string, pass: string, username?: string) {
    // 1. Controlla se l'utente esiste già
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new CustomException(
        'Email già registrata',
        HttpStatus.CONFLICT,
        'Conflict'
      );
    }

    // 2. Hash della password (salt rounds = 10 è lo standard)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    // 3. Salva su db
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    return { message: 'Registrazione completata con successo', userId: newUser.id };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Cerchiamo l'utente
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new CustomException('Credenziali non valide', HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    // 2. Verifichiamo la password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomException('Credenziali non valide', HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    // 3. Generiamo il JWT
    const payload = { 
        sub: user.id, 
        email: user.email, 
        username: user.username, 
        iss: this.configService.get('ISS_JWT'),
        aud: this.configService.get('AUD_JWT'),
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }


}
