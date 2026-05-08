import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [PrismaModule, ServicesModule, AppointmentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}