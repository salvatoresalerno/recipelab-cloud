// media.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { CustomException } from 'src/common/custom-exception/CustomException';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediaService {

    constructor(private prisma: PrismaService) {}

    private readonly uploadRootDir = join(process.cwd(), 'uploads');

        async verifyAndGetStream(resource: string, filename: string, userId: string) {
        // 1. Mappatura Risorsa -> Modello Prisma
        // Questo evita di passare nomi di tabelle arbitrarie dal frontend
        const resourceToModel: Record<string, any> = {
            'categorie': this.prisma.categoria,
            'bandiere': this.prisma.area,
            //'ricette': this.prisma.ricetta,
            //'ingredienti': this.prisma.ingrediente,
            //'step': this.prisma.stepRicetta,
        };

        const model = resourceToModel[resource];

        if (!model) {
            throw new NotFoundException('Risorsa non valida');
        }

        // 2. Controllo incrociato sul Database
        // Cerchiamo un record che abbia quel nome file E appartenga all'utente
        const record = await model.findFirst({
            where: {
                image: filename, // Il campo deve chiamarsi 'image' in tutte le tabelle o lo rendi dinamico
                userId: userId,
            },
        });

        if (!record) {
            throw new ForbiddenException('Non hai i permessi per accedere a questo file');
        }

        // 3. Verifica fisica del file
        const filePath = join(this.uploadRootDir, resource, filename);

        if (!existsSync(filePath)) {
            throw new NotFoundException('File non trovato sul server');
        }

        return createReadStream(filePath);
    }

  /* getFileStream(resource: string, filename: string) {
    // Costruisce il path: uploads/categorie/file.jpg oppure uploads/ricette/file.jpg
    const filePath = join(this.uploadRootDir, resource, filename);

    if (!existsSync(filePath)) {
      throw new CustomException(`Risorsa ${resource}/${filename} non trovata`);
    }

    return createReadStream(filePath);
  } */
}