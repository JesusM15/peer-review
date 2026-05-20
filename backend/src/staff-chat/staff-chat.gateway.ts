import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StaffChatService } from './staff-chat.service';
import { CongresosService } from '../congresos/congresos.service';
import { Rol } from '../users/entities/user.entity';

@WebSocketGateway({ namespace: '/' })
export class StaffChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(StaffChatGateway.name);

  constructor(
    private jwtService: JwtService,
    private staffService: StaffChatService,
    private congresosService: CongresosService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('StaffChatGateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;
      this.logger.log(`Connection attempt - token present: ${!!token}`);
      if (!token) {
        this.logger.warn('Connection rejected: No token provided');
        client.disconnect(true);
        return;
      }

      const payload: any = this.jwtService.verify(token as string, {
        ignoreExpiration: false,
      });
      const userId = payload?.sub || payload?.id;
      const congresoId =
        client.handshake.query?.congresoId || client.handshake.auth?.congresoId;

      this.logger.log(
        `Connection attempt - userId: ${userId}, congresoId: ${congresoId}`,
      );

      if (!userId || !congresoId) {
        this.logger.warn(`Connection rejected: Missing userId or congresoId`);
        client.disconnect(true);
        return;
      }

      // Verify membership - Revisores can join (read-only), Editors/Admins can read and write
      const memberships = await this.congresosService.getMemberships(userId);
      this.logger.log(
        `User ${userId} memberships: ${JSON.stringify(memberships)}`,
      );
      const membership = memberships.find((m) => m.congreso_id === congresoId);
      const allowed =
        membership &&
        (membership.rol === Rol.EDITOR ||
          membership.rol === Rol.ADMIN ||
          membership.rol === Rol.REVISOR);
      this.logger.log(
        `User ${userId} allowed for congreso ${congresoId}: ${allowed}, role: ${membership?.rol}`,
      );
      if (!allowed) {
        this.logger.warn(
          `Connection rejected: User not Editor, Admin, or Revisor for congreso ${congresoId}`,
        );
        client.disconnect(true);
        return;
      }

      client.data.userId = userId;
      client.data.userName =
        payload?.nombre || payload?.username || payload?.email || 'Usuario';
      client.data.userRole = membership?.rol;
      client.join(`staff:${congresoId}`);
      this.logger.log(
        `Client ${userId} connected and joined staff:${congresoId} as ${membership?.rol}`,
      );
    } catch (err) {
      this.logger.warn('Connection rejected: ' + err.message);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Message events
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { congresoId: string; content: string },
  ) {
    const userId = client.data.userId;
    const userName = client.data.userName;
    const userRole = client.data.userRole;

    if (!userId) return;

    // Revisores can only read, not send messages
    if (userRole === Rol.REVISOR) {
      this.logger.warn(
        `User ${userId} (Revisor) attempted to send message - blocked`,
      );
      return;
    }

    const msg = await this.staffService.saveMessage({
      congreso_id: payload.congresoId,
      sender_id: userId,
      sender_name: userName,
      content: payload.content,
    });
    this.server.to(`staff:${payload.congresoId}`).emit('message', msg);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { congresoId: string },
  ) {
    const userId = client.data.userId;
    const name = client.data.userName;
    if (!userId) return;
    this.server
      .to(`staff:${payload.congresoId}`)
      .emit('typing', { userId, name });
  }
}
