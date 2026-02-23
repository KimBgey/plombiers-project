import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — autoriser le frontend Vercel et le local
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://plombiers-project.vercel.app',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`🚀 Server running on port ${process.env.PORT ?? 3000}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
