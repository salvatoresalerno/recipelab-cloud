import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/custom-exception/prisma-exception.filter';
import { CustomValidationException } from './common/custom-exception/CustomValidationException';
import helmet from 'helmet';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new PrismaExceptionFilter());

  app.use(helmet());

  //app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    //new SanitizeAndTrimPipe(),
    new ValidationPipe({
      transform: true,  //permette trasformazione parametri tipo email --> lowercase
      whitelist: true,  //rimuive parametri non previsti nei dto
      forbidNonWhitelisted: true,  //lancia eccezione se presenti parametri non previsiti
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map(err => ({
          field: err.property,
          errors: Object.values(err.constraints!),
        }));
        return new CustomValidationException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'validationErrorMessage',  //tag per messaggio i18n per il FE
          code: 'AV1120',
          error: formattedErrors,
        });
      },
    }),
  );     

  app.enableCors({
    origin: true, // o l'indirizzo della tua app electron
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
