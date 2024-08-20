import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([{
    transport: Transport.NATS,
    name: 'USER_SERVICE',
    options: {
      servers: "nats://user_service"
    }
  }])],
  controllers: [],
  providers: [],
})
export class AppModule { }
