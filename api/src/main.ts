import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { PasswordInterceptor } from './common/interceptors/password-interceptor/password.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new PasswordInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT);
}
bootstrap();
