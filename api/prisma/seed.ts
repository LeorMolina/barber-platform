import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Limpa todos os serviços existentes
  await prisma.service.deleteMany();

  // 2. Planta os novos serviços (Agora com duration em números!)
  const services = [
    { name: 'Cabelo', duration: 30, price: 40.00 },
    { name: 'Barba', duration: 30, price: 35.00 },
    { name: 'Cabelo e Barba', duration: 60, price: 70.00 }, // 1 hora = 60 minutos
    { name: 'Sobrancelha', duration: 15, price: 15.00 },
    { name: 'Pezinho', duration: 15, price: 10.00 },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  console.log('✅ Banco de dados semeado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });