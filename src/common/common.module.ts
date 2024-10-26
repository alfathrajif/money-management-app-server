import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { ValidationService } from './validation.service';
import { z } from 'zod';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development.local', 'staging.local', 'production.local'])
    .default('development.local'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  DATABASE_URL: z.string(),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  AUTH_COOKIE_NAME: z.string(),
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development.local'}`,
      validate: (config) => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          console.error('Invalid environment variables:', result.error.errors);
          throw new Error('Invalid environment configuration');
        }
        return result.data;
      },
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService],
})
export class CommonModule {}
