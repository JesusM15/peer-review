import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as webpush from 'web-push';
import { v4 as uuidv4 } from 'uuid';
import { PushSubscription } from './entities/push-subscription.entity';
import { PushSubscribeDto } from './dto/push-subscribe.dto';

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger(PushService.name);
  private enabled = false;

  constructor(
    @InjectRepository(PushSubscription)
    private readonly subscriptionRepo: Repository<PushSubscription>,
  ) {}

  onModuleInit() {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject =
      process.env.VAPID_SUBJECT || 'mailto:soporte@peerreview.local';

    if (!publicKey || !privateKey) {
      this.logger.warn(
        'VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY no configuradas. Push deshabilitado.',
      );
      return;
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);
    this.enabled = true;
    this.logger.log('Web Push habilitado con VAPID.');
  }

  getPublicKey(): string | null {
    return process.env.VAPID_PUBLIC_KEY || null;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async subscribe(userId: string, dto: PushSubscribeDto): Promise<PushSubscription> {
    const existing = await this.subscriptionRepo.findOne({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      existing.user_id = userId;
      existing.p256dh = dto.keys.p256dh;
      existing.auth = dto.keys.auth;
      return this.subscriptionRepo.save(existing);
    }

    const sub = this.subscriptionRepo.create({
      id: uuidv4(),
      user_id: userId,
      endpoint: dto.endpoint,
      p256dh: dto.keys.p256dh,
      auth: dto.keys.auth,
    });
    return this.subscriptionRepo.save(sub);
  }

  async unsubscribe(userId: string, endpoint: string): Promise<void> {
    await this.subscriptionRepo.delete({ user_id: userId, endpoint });
  }

  async sendToUser(userId: string, payload: PushPayload): Promise<void> {
    if (!this.enabled) return;

    const subs = await this.subscriptionRepo.find({ where: { user_id: userId } });
    if (subs.length === 0) return;

    const body = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || '/',
      tag: payload.tag,
    });

    await Promise.all(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            body,
          );
        } catch (error: any) {
          if (error?.statusCode === 404 || error?.statusCode === 410) {
            await this.subscriptionRepo.delete({ id: sub.id });
          } else {
            this.logger.warn(
              `Error enviando push a ${sub.endpoint}: ${error?.message}`,
            );
          }
        }
      }),
    );
  }
}
