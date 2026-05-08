import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  // Cria o agendamento no banco
  async create(data: Prisma.AppointmentUncheckedCreateInput) {
    return this.prisma.appointment.create({
      data,
      include: { service: true } // Já traz os dados do serviço (nome, preço) junto
    });
  }

  // Busca todos os agendamentos de um telefone específico
  async findByPhone(phone: string) {
    return this.prisma.appointment.findMany({
      where: { phone },
      include: { service: true },
      orderBy: [{ date: 'asc' }, { time: 'asc' }] // Organiza por data e hora
    });
  }
}