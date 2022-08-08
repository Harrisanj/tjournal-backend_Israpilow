import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Контроллер - это та логика, которая преднозначена для опеределенного функционала
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
