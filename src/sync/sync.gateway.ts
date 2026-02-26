
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'

@WebSocketGateway({
  cors: { origin: '*' }
})
@Injectable()
export class SyncGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  constructor(private jwtService: JwtService) {
    console.log('SyncGateway ISTANZA creata', Date.now())
  }

  

  async handleConnection(client: Socket) {
    try {
      console.log('Tentativo connessione', client.id)

      const token = client.handshake.auth?.token
      const aa = client.handshake.auth?.deviceId

      console.log('device ID AA = ', aa)
      
      if (!token) {
        client.disconnect()
        return
      }

      const payload = this.jwtService.verify(token)
      const userId = payload.sub

      const room = `user_${userId}`
      client.join(room)

      console.log(`Client ${client.id} join room ${room}`)
    } catch (error) {
      console.log('JWT non valido')
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnesso', client.id)
  }

  /**
   * 🔥 Evento unico di sincronizzazione
   */
  notifyEntityChange(userId: string, payload: {
    entity: string
    type: 'created' | 'updated' | 'deleted'
    id: string
    updatedAt: Date
    deviceId: string
  }) {
    console.log('Emissione entity_changed per user:', userId)
    console.log('Payload:', payload)

    this.server
      .to(`user_${userId}`)
      .emit('entity_changed', payload)
  }
}










/*  

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class SyncGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  constructor(private jwtService: JwtService) {
    console.log('SyncGateway ISTANZA creata', Date.now())
  }

  async handleConnection(client: Socket) {
    try {
       console.log('Tentativo connessione', client.id)
      const token = client.handshake.auth?.token

      if (!token) {
        client.disconnect()
        return
      }

      const payload = this.jwtService.verify(token)

      const userId = payload.sub // o payload.userId

      const room = `user_${userId}`

      client.join(room)

      console.log(`Client connesso user ${userId}`)
      console.log(`Client ${client.id} join room user_${userId}`)
    } catch (error) {
      console.log('JWT non valido')
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnesso')
  }

  notifyUser(userId: string, event: string, data: any) {

    console.log('Emissione evento per user:', userId, 'Event:', event)
    console.log('Client rooms:', this.server.sockets.adapter.rooms)


     this.server.to(`user_${userId}`).emit(event, data)

     
  }
} */