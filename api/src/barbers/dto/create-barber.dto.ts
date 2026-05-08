import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBarberDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}