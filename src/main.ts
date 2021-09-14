import * as dotenv from 'dotenv';
dotenv.config();

import * as apm from 'elastic-apm-node';
if (process.env.NODE_ENV === 'production') {
  const { ELASTIC_APM_SECRET_TOKEN, ELASTIC_APM_SERVER_URL } = process.env;
  if (!ELASTIC_APM_SECRET_TOKEN || !ELASTIC_APM_SERVER_URL) {
    console.warn(
      'ELASTIC APM envs variabled not available, skipping APM start ...',
    );
  } else {
    apm.start();
    console.log('Elastic APM Agent started ...');
  }
}

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  Environment,
  EnvironmentVariables,
} from './environment/env.validation';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { initSwagger } from './swagger/init';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { fastifyHelmet } from 'fastify-helmet';

async function bootstrap() {
  // Using fastify as default, change to Express for more libraries compatibility
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      // logger: true
    }),
  );

  // Getting env vars
  const configService: ConfigService<EnvironmentVariables> =
    app.get(ConfigService);
  const mode = configService.get('NODE_ENV', Environment.development, {
    infer: true,
  });
  const serverUrl = configService.get('SERVER_URL', { infer: true });
  const port = configService.get('HTTP_PORT', 3000, { infer: true });

  // Set security headers to all routes. https://www.npmjs.com/package/helmet
  app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  // TODO: Register cookie session (optional)
  // app.register(secureSession, {
  //   secret: 'averylogphrasebiggerthanthirtytwochars',
  //   salt: 'mq9hDxBVDbspDR6n',
  // });

  // ? Should set CSRF helper here (e.g: csurf) if you're using cookie-based session
  // app.register(fastifyCsrf);
  // ? Meanwhile JWT method of auth doesn't expose you to CSRF attacks (as of writing)

  // Route modification
  app.setGlobalPrefix('api');

  /**
   * Validation pipes globally - validate incoming payload from request
   * and transform as required by inferring class-validator decorators
   */
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  /**
   * This serializer interceptor will check if any property was marked @exclude
   * preventing sensitive data leak downstream
   */
  // ? To recheck if this is working - the other workaround is to create a custom reflector and add here
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Enabling shutdown hooks for Terminus to hook on
  app.enableShutdownHooks();

  // Cors (optional)
  // app.enableCors();

  // Init Openapi Doc server (Swagger) and/or api spec file
  initSwagger({ app, serverUrl, hostDoc: true, produceSpecFile: false });

  // Server start (binding to 0.0.0.0 for Docker as Fastify defaulted to 127.0.0.1)
  await app.listen(port, '0.0.0.0', () => {
    Logger.log(`Listening on port ${port} ...`);
  });
}
bootstrap();
