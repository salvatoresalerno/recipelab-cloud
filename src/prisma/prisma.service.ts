import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {

    console.log('USER FROM ENV:', configService.get('DB_USERNAME'));
  console.log('DB NAME FROM ENV:', configService.get('DB_NAME'));
    // Configura l'adapter per MariaDB con i parametri di connessione
    const adapter = new PrismaMariaDb({
      host: configService.get<string>('DB_HOST', 'localhost'),
      port: configService.get<number>('DB_PORT', 3306),
      user: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      connectionLimit: 10,
      allowPublicKeyRetrieval: true
    });
    
    // Passa l'adapter al costruttore di PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    // Connette al database quando il modulo viene inizializzato
    await this.$connect();
  }

  async onModuleDestroy() {
    // Disconnette quando l'applicazione viene spenta
    await this.$disconnect();
  }
}