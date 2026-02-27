import { Injectable } from '@nestjs/common';
import { ChangeLog } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SyncGateway } from 'src/sync/sync.gateway';

@Injectable()
export class TestService {

    constructor(
        private prisma: PrismaService,
        private syncGateway: SyncGateway
    ) {}

    private readonly BATCH_SIZE = 200;

    async findOne(userId: string, id: string) {

        console.log('userId, id: ', userId, id)
        const item = await this.prisma.testItem.findUnique({
            where: { id, userId }
        });

        return item;
    }



    /*async create(userId: string, title: string, deviceId: string) {
         const item = await this.prisma.testItem.create({
            data: {
                userId,
                title
            }
        })

        // 🔥 Notifica realtime
        this.syncGateway.notifyEntityChange(userId, {
            entity: 'test',
            type: 'created',
            id: item.id,
            updatedAt: item.updatedAt,
            deviceId
        })         
    })*/

  /*   async create(userId: string, title: string, deviceId: string) {

        const result = await this.prisma.$transaction(async (tx) => {
            const item = await tx.testItem.create({ 
            data: { userId, title }
            })

            const changeLog = await tx.changeLog.create({
                data: {
                    userId,
                    tableName: "testItem",
                    recordId: item.id,
                    operation: "create"
                }
            })

            return { item, changeLog }
        })

        // 🔥 Notifica DOPO il commit
        this.syncGateway.notifyEntityChange(userId, {
            entity: 'test',
            type: 'created',
            id: result.item.id,
            updatedAt: result.item.updatedAt,
            deviceId,
            changeId: result.changeLog.id.toString()
        })

        return result.item
    }   */ 

        // test.service.ts

async create(userId: string, title: string, deviceId: string) {
  const result = await this.prisma.$transaction(async (tx) => {
    // 1. Creazione record principale
    const item = await tx.testItem.create({
      data: { userId, title }
    });

    // 2. Creazione del log con PAYLOAD
    const changeLog = await tx.changeLog.create({
      data: {
        userId,
        entity: 'testItem',
        recordId: item.id,
        operation: 'create',
        deviceId: deviceId,
        payload: item, // Salviamo l'oggetto appena creato
      }
    });

    return { item, changeLog };
  });

  // 3. Notifica via WebSocket
  // Inviamo l'intero changeLog, così il client ha già tutto
  this.syncGateway.notifyEntityChange(userId, {
    entity: result.changeLog.entity,
    type: result.changeLog.operation as any,
    id: result.changeLog.recordId,
    updatedAt: result.item.updatedAt,
    deviceId: deviceId,
    changeId: result.changeLog.id.toString(),
    data: result.item // Includiamo i dati nella notifica real-time
  });

  return result.item;
}




    async update(userId: string, id: string, title: string, deviceId: string) {
        const item = await this.prisma.testItem.update({
            where: { id },
            data: { title }
        })

        this.syncGateway.notifyEntityChange(userId, {
            entity: 'test',
            type: 'updated',
            id: item.id,
            updatedAt: item.updatedAt,
            deviceId,
            changeId: ""//changeLog.id.toString()
        })

        return item
    }





    async getChangesSince(userId: string, lastId: string): Promise<any[]> {

        console.log('lastChangeId: ', lastId)
        console.log('userId: ', userId)

        const changes: ChangeLog[] = await this.prisma.changeLog.findMany({
            where: {
                userId: userId,
                id: {
                    gt: BigInt(lastId), // Convertiamo la stringa in BigInt per la query
                },
            },
            orderBy: {
                id: 'asc', // Fondamentale per l'ordine cronologico nel client
            },
        });

        // Tipizziamo il map per evitare l'errore "implicitly has any type"
        return changes.map((c: ChangeLog) => ({
            ...c,
            id: c.id.toString(), // Trasformiamo il BigInt in stringa
        }));
    }









    /* async getChangesSince(sinceId: string, userId: string) {
        const changes = await this.prisma.changeLog.findMany({
            where: {
                userId,
                id: { gt: BigInt(sinceId) }
            },
            orderBy: { id: 'asc' }
        })

        return { changes }
    } */



   async getChanges(userId: string, lastChangeId: string, tables: string[]) {


    const whereCondition: any = {
      userId,
      id: {
        gt: BigInt(lastChangeId)
      }
    };

    if (tables.length > 0) {
      whereCondition.tableName = {
        in: tables
      };
    }

    const changes = await this.prisma.changeLog.findMany({
      where: whereCondition,
      orderBy: {
        id: 'asc'
      },
      take: this.BATCH_SIZE
    });

    const lastReturnedId =
      changes.length > 0
        ? changes[changes.length - 1].id
        : BigInt(lastChangeId);

    return {
      changes: changes.map(c => ({
        ...c,
        id: Number(c.id)
      })),
      hasMore: changes.length === this.BATCH_SIZE,
      lastChangeId: Number(lastReturnedId)
    };
  }



}
