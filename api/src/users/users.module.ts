import { Module } from '@nestjs/common'
import { UsersController } from './users.controller';
import { NatsModule } from 'src/nats/nats.module';
import { AuthController } from './auth.controller';

@Module({
    imports: [NatsModule],
    controllers: [UsersController, AuthController],
})
export class UsersModule { }
