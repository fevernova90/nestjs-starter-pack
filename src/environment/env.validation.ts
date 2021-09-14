import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';

export enum Environment {
  development = 'development',
  // staging = 'staging',
  production = 'production',
  test = 'test',
}

export enum DEBUG_LEVEL {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  APP_NAME: string;

  @IsString()
  @IsOptional()
  API_VERSION?: string;

  @IsString()
  @IsUrl()
  SERVER_URL: string;

  @IsString()
  POSTGRES_URI: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsEnum(DEBUG_LEVEL)
  @IsOptional()
  DEBUG_LEVEL?: DEBUG_LEVEL = DEBUG_LEVEL.DEBUG;

  @IsNumber()
  @IsOptional()
  HTTP_PORT?: number;

  @IsOptional()
  ELASTIC_APM_SERVICE_NAME?: string;
  @IsOptional()
  ELASTIC_APM_ENVIRONMENT?: string;
  @IsOptional()
  ELASTIC_APM_SECRET_TOKEN?: string;
  @IsOptional()
  ELASTIC_APM_SERVER_URL?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    console.error(errors);
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
