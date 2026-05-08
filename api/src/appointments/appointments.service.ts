import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const appointmentDate = new Date(createAppointmentDto.date);
    const now = new Date();

    // REGRA 1: Não permitir agendamentos no passado
    if (appointmentDate < now) {
      throw new BadRequestException('Não é possível agendar em uma data que já passou.');
    }

    // REGRA 2: Bloquear horários duplicados (Overbooking)
    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        barberId: createAppointmentDto.barberId,
        date: appointmentDate,
      },
    });

    if (conflictingAppointment) {
      throw new BadRequestException('Este barbeiro já possui um agendamento neste exato horário.');
    }

    // Se passou pelas regras, salva no banco de dados
    return this.prisma.appointment.create({
      data: {
        date: appointmentDate,
        barberId: createAppointmentDto.barberId,
        clientId: createAppointmentDto.clientId,
        serviceId: createAppointmentDto.serviceId,
      },
    });
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      include: {
        barber: true,
        client: true,
        service: true,
      },
    });
  }
}