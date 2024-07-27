import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PasswordInterceptor } from './common/interceptors/password-interceptor/password.interceptor';
import * as session from 'express-session';
import { sessionSecret } from './common/constants/secrets';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new PasswordInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  }))

  await app.listen(3000);
}
bootstrap();
