import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Configura l'adapter per MariaDB con i parametri di connessione
    const adapter = new PrismaMariaDb({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10, // Opzionale: numero massimo di connessioni nel pool
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