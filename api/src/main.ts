import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4000);

  // 🔹 Log toutes les routes disponibles
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes = router.stack
    .map((layer) => layer.route?.path)
    .filter((path) => path !== undefined);

  Logger.log(
    `📌 Routes disponibles : ${availableRoutes.join(', ')}`,
    'NestApplication',
  );
  Logger.log('🚀 Application running on http://localhost:4000', 'Bootstrap');
}
bootstrap();
