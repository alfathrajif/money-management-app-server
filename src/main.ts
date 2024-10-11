import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const clientUrl = app.get(ConfigService).getOrThrow('CLIENT_URL');

  app.useLogger(app.get(Logger));
  app.enableCors({ origin: clientUrl, credentials: true });

  app.use(cookieParser());

  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
}
bootstrap();
