// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Rende il PrismaService disponibile ovunque senza re-importare il modulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Permette l'iniezione negli altri Service
})
export class PrismaModule {}