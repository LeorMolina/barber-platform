import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Isto permite que o seu Frontend (porta 3001) aceda aos dados do Backend (porta 3000)
  app.enableCors(); 
  
  await app.listen(3000);
}
bootstrap();