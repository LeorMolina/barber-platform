import { Module } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { BarbersController } from './barbers.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BarbersController],
  providers: [BarbersService, PrismaService],
})
export class BarbersModule {}