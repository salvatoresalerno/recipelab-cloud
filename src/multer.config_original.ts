
 
import { diskStorage } from 'multer';
import { Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { extname, join } from 'path';
import { existsSync } from 'fs';
import { CustomException } from './common/custom-exception/CustomException';

interface MulterFile extends Express.Multer.File {}


function getUniqueFilename(destination: string, filename: string): string {
  //se chiamata crea nome file progressivo a quello esistente
  const ext = extname(filename);
  const base = filename.slice(0, -ext.length);
  let uniqueName = filename;
  let counter = 1;

  while (existsSync(join(destination, uniqueName))) {
    uniqueName = `${base}-${counter}${ext}`;
    counter++;
  }

  return uniqueName;
}


/*
  destination --> cartella di destinazione
  fileNameField --> nome del campo con il quale creare il fileName
  overwriteFileExist --> flag per permettere o no overwrite in caso di file esistente
*/

export function createMulterConfig(
  destination: string, 
  maxSizeMB = 10, 
  fileNameField?: string, // Reso opzionale
  overwriteFileExist: boolean = true
) {
  return {
    storage: diskStorage({
      destination,
      filename: (
        _req: Request,
        file: MulterFile,
        cb: (error: Error | null, filename: string) => void,
      ) => {
        // 1. Verifica autenticazione (mantenuta come da tuo codice)
        const userId = _req.user?.userId;
        if (!userId) {
          return cb(new CustomException('Errore upload: utente non autenticato', HttpStatus.BAD_REQUEST, 'Bad Request', 'UPLOAD_NO_USER'), '');
        }

        let finalName: string;
        const ext = extname(file.originalname);

        // 2. LOGICA NOME FILE: Priorità al campo indicato, altrimenti nome originale
        const rawNameFromBody = fileNameField ? _req.body?.[fileNameField] : null;

        if (fileNameField && rawNameFromBody && typeof rawNameFromBody === 'string') {
          // Se hai passato un field (es. 'categoria') e il field esiste, usa quello
          const baseName = rawNameFromBody.replace(/\.[^/.]+$/, '');
          const safeName = baseName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
          finalName = `${safeName}${ext}`;
        } else {
          // Se NON hai passato un field o il field è vuoto, usa il nome originale (il tuo GUID.jpg)
          // Sanitizziamo comunque per sicurezza, ma manteniamo la struttura originale
          finalName = file.originalname.replace(/\s/g, '_');
        }

        // 3. Controllo unicità
        const uniqueName = overwriteFileExist 
          ? finalName 
          : getUniqueFilename(destination, finalName);

        cb(null, uniqueName);
      },
    }),
    // ... resto della config (limits e fileFilter rimangono identici)
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (
      _req: Request,
      file: MulterFile,
      cb: (error: any, acceptFile: boolean) => void,
    ) => {
      if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp|avif)$/)) {
        return cb(
          new CustomException(
            'Solo immagini JPEG, JPG, PNG, WebP o Avif',
            HttpStatus.BAD_REQUEST,
            'Bad Request',
            'UPLOAD_INVALID_TYPE',
          ),
          false,
        );
      }
      cb(null, true);
    },
  };
}

