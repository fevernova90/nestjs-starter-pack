import * as dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const databaseConfig: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  migrationsRun: true,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/**/*.js'],
  cli: { migrationsDir: 'src/db/migrations' },
};

const typeOrmModuleOptions: TypeOrmModuleOptions = {
  ...databaseConfig,
  autoLoadEntities: true,
};

export default typeOrmModuleOptions;
