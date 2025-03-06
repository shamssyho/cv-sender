import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4000);

  Logger.log('🚀 Application running on http://localhost:3000', 'Bootstrap');
}
bootstrap();
