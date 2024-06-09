import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.use(helmet());
  //app.use(compression());
  app.enableCors();
  //app.useGlobalFilters(new HttpExceptionFilter());
  app
    .useGlobalPipes
    // new ValidationPipe({
    //   whitelist: true,
    //   forbidNonWhitelisted: false,
    // }),
    ();

  // Setup Swagger
  setupSwagger(app);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
