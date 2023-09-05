import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function initProyect() {
  const app = await NestFactory.create(AppModule);

  // Defining the global prefix
  app.setGlobalPrefix('/api/v1');

  await app.listen(3000);
}

initProyect();
