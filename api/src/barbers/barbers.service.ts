import { Injectable } from '@nestjs/common';
import { CreateBarberDto } from './dto/create-barber.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BarbersService {
  constructor(private prisma: PrismaService) {}

  create(createBarberDto: CreateBarberDto) {
    return this.prisma.barber.create({
      data: createBarberDto,
    });
  }

  findAll() {
    return this.prisma.barber.findMany();
  }
}