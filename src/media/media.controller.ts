import { Controller, Get, Param, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { CustomException } from 'src/common/custom-exception/CustomException';
import type { Response } from 'express';
import type { CurrentUser } from 'src/common/types/commonTypes';
import { CurrentLoggedUser } from 'src/auth/decorators/currentLoggedUser.decorators';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}



  @UseGuards(JwtAuthGuard)
  @Get(':resource/:filename') // Endpoint dinamico: es. media/categorie/uuid.jpg
  async getFile(
    @CurrentLoggedUser() user: CurrentUser,
    @Param('resource') resource: string,
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Possiamo aggiungere una whitelist di risorse per sicurezza
    const validResources = ['categorie', 'ricette', 'ingredienti', 'step'];
    if (!validResources.includes(resource)) {
      throw new CustomException('Categoria risorsa non valida');
    }

    //const fileStream = this.mediaService.getFileStream(resource, filename);
    const fileStream = await this.mediaService.verifyAndGetStream(
      resource, 
      filename, 
      user.userId
    );

    // Impostiamo l'header in base all'estensione o forziamo jpeg se sono tutte immagini
    res.set({
      'Content-Type': 'image/jpeg', 
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'private, max-age=3600', // Ottimo per il client Electron
    });

    return new StreamableFile(fileStream);
  }

  /* @UseGuards(JwtAuthGuard) 
  @Get('categorie/:filename')
  async getCategoriaImage(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {

    //verifico se il file appartiene all'utente
     const belongsToUser = await this.prisma.categoria.findFirst({
      where: { image: filename, userId: user.userId }
    });

    if (!belongsToUser) {
      throw new ForbiddenException('Non hai i permessi per accedere a questa risorsa');
    }  
    // Path assoluto alla cartella degli upload
    const filePath = join(process.cwd(), 'uploads/categorie', filename);

    if (!existsSync(filePath)) {
      throw new CustomException('Immagine non trovata');
    }

    // Opzionale: Imposta il Content-Type corretto
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    const file = createReadStream(filePath);
    return new StreamableFile(file);
  } */

}
