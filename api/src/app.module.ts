import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { BarbersModule } from './barbers/barbers.module';
import { ClientsModule } from './clients/clients.module';
import { ServicesModule } from './services/services.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AppointmentsModule,
    BarbersModule,
    ClientsModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}