import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { Environment, validate } from './environment/env.validation';
import { HealthController } from './health/health.controller';
import typeOrmModuleOptions from './ormconfig';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === Environment.production,
      envFilePath: resolve(__dirname, '..', '..', '.env'),
      isGlobal: true,
      cache: true,
      validate: validate,
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
