import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.client';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello() {
    return this.prisma.user.findMany();
  }
}
