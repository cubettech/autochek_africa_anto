import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'], // Only log error, warn, and log levels
  });

  const config = new DocumentBuilder()
    .setTitle('Autochek APIs')
    .setDescription('Following are the details of APIs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000; // set 3000 if PORT is not set

  await app.listen(port);
  Logger.log(`Application is running on port ${port}`);
}
bootstrap();
