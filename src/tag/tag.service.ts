import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SyncGateway } from 'src/sync/sync.gateway';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CustomException } from 'src/common/custom-exception/CustomException';

@Injectable()
export class TagService {

    constructor(private prisma: PrismaService, private syncGateway: SyncGateway) {}

    async create(userId: string, deviceId: string, body: CreateTagDto) {
    
        const result = await this.prisma.$transaction(async (tx) => {
            //salvataggio records
            const tag = await this.prisma.tag.create({
                data: {
                    tag: body.tag,
                    color: body.color,
                    userId  
                }
            });   

            //creazione del log con PAYLOAD
            const changeLog = await tx.changeLog.create({
                data: {
                    userId,
                    entity: 'tag',
                    recordId: tag.idTag,
                    operation: 'created',
                    deviceId: deviceId,
                    payload: tag, //salvo l'oggetto appena creato
                }
            });

            return { tag, changeLog };
        });
    
        //Notifica via WebSocket
        //Invio l'intero changeLog, così il client ha già tutto
        this.syncGateway.notifyEntityChange(userId, {
            entity: result.changeLog.entity,
            type: result.changeLog.operation as any,
            id: result.changeLog.recordId,
            updatedAt: result.tag.updatedAt,
            deviceId: deviceId,
            changeId: result.changeLog.id.toString(),
            data: result.tag // Includiamo i dati nella notifica real-time
        });

        return result.tag;     
    }

    async update(id: string, userId: string, deviceId: string, body: UpdateTagDto) {   
        const oldTag = await this.prisma.tag.findUnique({
            //where: { idTag: id, userId },
            where: {
                idTag_userId: {
                    idTag: id,
                    userId
                }
            },
            select: {
                idTag: true,
                tag: true,
                color: true,
                updatedAt: true
            }
        });

        if (!oldTag) {
            throw new CustomException('Tag non trovato.', HttpStatus.NOT_FOUND, 'Not Found');
        }

        const result = await this.prisma.$transaction(async (tx) => {
            //update record
            const tag = await this.prisma.tag.update({
                //where: { idTag: id, userId },
                where: {
                    idTag_userId: {
                        idTag: id,
                        userId
                    }
                },
                data: body
                /* data: { 
                    categoria: updateCategorieDto.categoria,
                    ...(updateCategorieDto.image && { image: updateCategorieDto.image })
                }   */              
            });

            //creazione del log con PAYLOAD
            const changeLog = await tx.changeLog.create({
                data: {
                    userId,
                    entity: 'tag',
                    recordId: tag.idTag,
                    operation: 'updated',
                    deviceId: deviceId,
                    payload: tag, //salvo l'oggetto appena creato
                }
            });

            return { tag, changeLog };
        });

        //Notifica via WebSocket
        //Invio l'intero changeLog, così il client ha già tutto
        this.syncGateway.notifyEntityChange(userId, {
            entity: result.changeLog.entity,
            type: result.changeLog.operation as any,
            id: result.changeLog.recordId,
            updatedAt: result.tag.updatedAt,
            deviceId: deviceId,
            changeId: result.changeLog.id.toString(),
            data: result.tag // Includiamo i dati nella notifica real-time
        });

        return result.tag;  

    }


    async remove(id: string, userId: string, deviceId: string) {  
        const tag = await this.prisma.tag.findUnique({
            //where: { idTag: id, userId },
            //select: { image: true, categoria: true }
            where: {
                idTag_userId: {
                    idTag: id,
                    userId
                }
            },
        });

        if (!tag) {
            throw new CustomException('Tag non trovata.', HttpStatus.NOT_FOUND, 'Not Found');
        }

        const result = await this.prisma.$transaction(async (tx) => {
            await this.prisma.tag.delete({
                //where: { idTag: id, userId },
                where: {
                    idTag_userId: {
                        idTag: id,
                        userId
                    }
                },
            });

            //creazione del log con PAYLOAD
            const changeLog = await tx.changeLog.create({
                data: {
                    userId,
                    entity: 'tag',
                    recordId: tag.idTag,
                    operation: 'deleted',
                    deviceId: deviceId,
                    payload: undefined
                }
            });

            return { changeLog };
        });

        
        //Notifica via WebSocket
        //Invio l'intero changeLog, così il client ha già tutto
        this.syncGateway.notifyEntityChange(userId, {
            entity: result.changeLog.entity,
            type: result.changeLog.operation as any,
            id: result.changeLog.recordId,
            updatedAt: null,
            deviceId: deviceId,
            changeId: result.changeLog.id.toString(),
            data: undefined
        });

        return null;  

    
    
    }
      

}
