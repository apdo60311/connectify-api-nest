import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {


  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: ["nats://nats"]
    }
  });



  const configService = app.get(ConfigService);

  // app.use(cookieParser(configService.get<string>('SESSION_SECRET'), {}))

  // app.use(session({
  //   secret: configService.get<string>('SESSION_SECRET'),
  //   resave: false,
  //   saveUninitialized: false,
  //   store: new TypeormStore().connect(sessionEntity)
  // }))


  await app.listen();
  // await app.listen(configService.get<number>('APP_PORT'));
}
bootstrap();
