import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Certifique-se de que o caminho está correto
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ServiceCreateInput) {
    return this.prisma.service.create({ data });
  }

  findAll() {
    return this.prisma.service.findMany();
  }

  findOne(id: string) {
    return this.prisma.service.findUnique({ where: { id } });
  }

  // 🚀 ROTA PATCH: Atualiza os dados do serviço
  update(id: string, data: Prisma.ServiceUpdateInput) {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  // 🧨 ROTA DELETE: Remove o serviço do banco
  remove(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}