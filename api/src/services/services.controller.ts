import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Prisma } from '@prisma/client';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() createServiceDto: Prisma.ServiceCreateInput) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  // 🚀 Escutando requisições de EDIÇÃO (PATCH)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: Prisma.ServiceUpdateInput) {
    return this.servicesService.update(id, updateServiceDto);
  }

  // 🧨 Escutando requisições de EXCLUSÃO (DELETE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}