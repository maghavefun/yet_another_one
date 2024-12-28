import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './setupSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('BACKEND_PORT');
  const logger = new Logger('Bootstrap');

  setupSwagger(app);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  await app.listen(port);

  const isProduction = configService.get('NODE_ENV') === 'production';

  if (isProduction) {
    Logger.overrideLogger(['error', 'warn']);
  } else {
    Logger.overrideLogger(['log', 'error', 'warn', 'debug', 'verbose']);
    logger.log(`Backend app is running on http://localhost:${port}`);
  }
}

bootstrap();
