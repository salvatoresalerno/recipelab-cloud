import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SyncGateway } from 'src/sync/sync.gateway';

@Injectable()
export class TestService {

    constructor(
        private prisma: PrismaService,
        private syncGateway: SyncGateway
    ) {}



    async findOne(userId: string, id: string) {

        console.log('userId, id: ', userId, id)
        const item = await this.prisma.testItem.findUnique({
            where: { id, userId }
        });

        return item;
    }



    async create(userId: string, title: string, deviceId: string) {
        /* const item = await this.prisma.testItem.create({
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
        }) */

        await this.prisma.$transaction(async (tx) => {
            const item = await tx.testItem.create({ 
                data: {
                    userId,
                    title
                }
             })

            this.syncGateway.notifyEntityChange(userId, {
                entity: 'test',
                type: 'created',
                id: item.id,
                updatedAt: item.updatedAt,
                deviceId
            })

            await tx.changeLog.create({
                data: {
                userId,
                tableName: "testItem",
                recordId: item.id,
                operation: "create"
                }
            })

            return item
        })
        

     
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
            deviceId
        })

        return item
    }















    async getChangesSince(date: Date, userId: string) {
        const updated = await this.prisma.testItem.findMany({
            where: {
            userId,
            updatedAt: { gt: date }
            }
        })

        return {
            updated
        }
    }

}
