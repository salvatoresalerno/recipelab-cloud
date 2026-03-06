
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SyncGateway } from 'src/sync/sync.gateway';
import { CreateCategorieDto } from './dto/create-categorie.dto';

@Injectable()
export class CategoriaService {

    constructor(
        private prisma: PrismaService,
        private syncGateway: SyncGateway
    ) {}

    async create(userId: string, deviceId: string, body: CreateCategorieDto) {

        const result = await this.prisma.$transaction(async (tx) => {
            //salvataggio records
            const categoria = await this.prisma.categoria.create({
                data: {
                    categoria: body.categoria,
                    image: body.image,
                    userId  
                }
            });   

            //creazione del log con PAYLOAD
            const changeLog = await tx.changeLog.create({
                data: {
                    userId,
                    entity: 'categoria',
                    recordId: categoria.idCategoria,
                    operation: 'create',
                    deviceId: deviceId,
                    payload: categoria, //salvo l'oggetto appena creato
                }
            });

            return { categoria, changeLog };
        });
    
        //Notifica via WebSocket
        //Invio l'intero changeLog, così il client ha già tutto
        this.syncGateway.notifyEntityChange(userId, {
            entity: result.changeLog.entity,
            type: result.changeLog.operation as any,
            id: result.changeLog.recordId,
            updatedAt: result.categoria.updatedAt,
            deviceId: deviceId,
            changeId: result.changeLog.id.toString(),
            data: result.categoria // Includiamo i dati nella notifica real-time
        });

        return result.categoria;     
    }
    
}




/*
Capisco perfettamente il contesto: un'architettura Electron + Next.js con Local-First cambia completamente le carte in tavola. In questo caso, il server WebSocket non deve "inviare" il file (che sarebbe inefficiente), ma deve fungere da "segnalatore" che dice al client: "Ehi, ho un nuovo file, scaricalo quando puoi".

Poiché lavori con un database locale (es. SQLite/IndexedDB), la strategia corretta è il Download in Background.

La Strategia: "Sync Metadata First, File Later"
Non forzare il server a spingere il binario. Segui questo flusso:

Notifica WebSocket: Il server invia solo il payload JSON (il changeLog e l'oggetto categoria con il nome del file UUID.jpg).

Ricezione Client: Il tuo client (Electron) riceve la notifica e aggiorna il DB locale.

Coda di Download (Background Sync):

Il client verifica se il file UUID.jpg è già presente nella cartella locale uploads/categorie.

Se non c'è, aggiunge l'URL del file a una coda di download.

Il client scarica il file dal server Cloud tramite una semplice chiamata fetch e lo salva nel filesystem locale (tramite le API di Node.js integrate in Electron).

Perché questa strategia è ideale per Electron?
Offline-First: Se l'utente è offline, la notifica WebSocket non arriverà, ma quando si riconnette, il client può confrontare le liste dei file (DB locale vs DB cloud) e scaricare i "gap".

Performance: Il tuo database locale rimane "leggero" (contiene solo i path), mentre il filesystem di Electron gestisce i binari pesante.

Nessun blocco: L'interfaccia utente rimane fluida mentre il file scarica in background.

Implementazione Pratica (Logica lato Electron)
Quando ricevi il messaggio dal WebSocket nel tuo processo di renderer o main:

TypeScript
// Esempio logica nel client Electron
async function handleNewCategory(data) {
    // 1. Salva nel DB locale (es. SQLite)
    await localDb.categories.add(data);

    // 2. Verifica se il file esiste localmente
    const localPath = path.join(app.getPath('userData'), 'uploads', data.image);
    
    if (!fs.existsSync(localPath)) {
        // 3. Download asincrono
        downloadFileFromCloud(data.image).then(buffer => {
             fs.writeFileSync(localPath, buffer);
             // Triggera un re-render per mostrare l'immagine appena scaricata
             eventEmitter.emit('image-downloaded', data.id);
        });
    }
}
Un punto cruciale: Le rotte statiche in NestJS
Per rendere questo possibile, il tuo BE Cloud deve avere una rotta pubblica (protetta da autenticazione) che permetta al client di scaricare il file.

Se non lo hai già fatto, in NestJS puoi servire la cartella di upload così:

TypeScript
// app.module.ts
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'uploads'),
  serveRoot: '/static', // Accessibile via GET /static/categorie/UUID.jpg
});
Qual è il vantaggio reale?
Il vantaggio è che il client Electron è il proprietario dei dati. Se il server cloud va giù o l'utente si scollega, l'immagine è già stata salvata fisicamente sul disco dell'utente. La notifica WebSocket è solo un "acceleratore" per mantenere i dispositivi sincronizzati in tempo reale.

Ti sembra un flusso gestibile o temi che la parte di gestione del filesystem su Electron possa creare conflitti di permessi?

*/