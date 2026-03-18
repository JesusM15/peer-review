import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ping')
  getPing() {
    return {
      message: '¡Pong! 🏓 Comunicación exitosa con NestJS en Docker',
      status: 'success',
      timestamp: new Date().toISOString()
    };
  }
}
