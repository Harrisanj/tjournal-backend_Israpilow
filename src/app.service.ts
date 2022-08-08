import { Injectable } from '@nestjs/common';

@Injectable() // Service - это та часть, где хранится бизнес логика
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
