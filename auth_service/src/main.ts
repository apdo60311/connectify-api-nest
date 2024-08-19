import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PasswordInterceptor } from './common/interceptors/password-interceptor/password.interceptor';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {


  const app = await NestFactory.create(AppModule, { abortOnError: false });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new PasswordInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);

  app.use(cookieParser(configService.get<string>('SESSION_SECRET'), {}))

  // app.use(session({
  //   secret: configService.get<string>('SESSION_SECRET'),
  //   resave: false,
  //   saveUninitialized: false,
  //   store: new TypeormStore().connect(sessionEntity)
  // }))


  await app.listen(configService.get<number>('APP_PORT'));
}
bootstrap();
