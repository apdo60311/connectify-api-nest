import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsModule } from './nats/nats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [NatsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
