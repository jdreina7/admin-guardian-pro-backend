import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function initProyect() {
  const app = await NestFactory.create(AppModule);

  // Defining the global prefix
  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors();

  await app.listen(process.env.PORT_DEVELOP);

  /* istanbul ignore next */
  console.log(`API running in port: ${process.env.PORT_DEVELOP}`);
}

initProyect();
