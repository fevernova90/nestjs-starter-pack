import { INestApplication, Logger } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { mkdir, writeFile } from 'fs';
import { resolve } from 'path';

interface InitSwaggerArgs {
  app: INestApplication;
  appName: string;
  apiVersion: string;
  serverUrl: string;
  hostDoc?: boolean;
  docTitle?: string;
  docRoute?: string;
  produceSpecFile?: boolean;
}

// Init swagger module
export function initSwagger({
  app,
  serverUrl,
  appName,
  apiVersion = 'v1.0',
  hostDoc = true,
  docTitle = 'API Documentation',
  docRoute = 'doc',
  produceSpecFile = false,
}: InitSwaggerArgs) {
  const swaggerDocConfig = new DocumentBuilder()
    .setTitle(docTitle)
    .setDescription(
      `Endpoints to be consumed by ${appName} authenticated clients.`,
    )
    .setVersion(apiVersion)
    .addServer(serverUrl, 'Live server')
//     .addBearerAuth(
//       {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//         name: 'JWT',
//         description: 'Enter access_token that you get from /auth/login.',
//         in: 'header',
//       },
//       'user',
//     )
    .build();

  const swaggerDocOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey, methodKey) => methodKey,
  };

  const document = SwaggerModule.createDocument(
    app,
    swaggerDocConfig,
    swaggerDocOptions,
  );

  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: `${appName} API ${apiVersion}`,
  };

  // Write the openapi spec file
  if (produceSpecFile) {
    const outputFolder = resolve(process.cwd(), 'open-api', apiVersion);
    const outputPath = resolve(outputFolder, 'client.spec.json');
    mkdir(outputFolder, { recursive: true }, (err) => {
      if (err) {
        Logger.warn('Failed to create folder during openapi init.');
      } else {
        writeFile(
          outputPath,
          JSON.stringify(document),
          { encoding: 'utf8' },
          (err) => {
            if (err) Logger.warn('Failed to create openapi spec file.');
          },
        );
      }
    });
  }
  // Host the spec
  if (hostDoc) {
    SwaggerModule.setup(docRoute, app, document, swaggerCustomOptions);
  }
}
