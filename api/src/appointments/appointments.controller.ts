import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Prisma } from '@prisma/client';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: Prisma.AppointmentUncheckedCreateInput) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findByPhone(@Query('phone') phone: string) {
    return this.appointmentsService.findByPhone(phone);
  }
}