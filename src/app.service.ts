import { Injectable } from '@nestjs/common';
import { PrismaService } from './config/db/prisma.service';

/** Функция привет */
@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService, // Inject PrismaService to use it in the service
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
}
