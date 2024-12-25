import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);
	const port = configService.get('BACKEND_PORT');
	const logger = new Logger('Bootstrap');

	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	await app.listen(port);

	const env = configService.get('NODE_ENV');
	if (env === 'dev') {
		logger.log(`Backend app is running on http://localhost:${port}`);
	}
}
bootstrap();
