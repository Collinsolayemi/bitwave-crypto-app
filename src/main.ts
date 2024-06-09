import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(compression());
  app.enableCors();
  //app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes;
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
  }),
    app.setGlobalPrefix('api/v1');
  // Setup Swagger
  setupSwagger(app);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
