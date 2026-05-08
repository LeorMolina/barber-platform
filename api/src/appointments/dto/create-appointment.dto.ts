import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  barberId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}
