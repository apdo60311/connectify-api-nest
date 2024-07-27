import { MiddlewareConsumer, Module, NestModule, Post } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './features/user-managment/users.module';
import { User } from './features/user-managment/entities/user.entity';
import { AuthModule } from './features/user-managment/auth/auth.module';
import { TwoFactorAuthModule } from './features/user-managment/auth/2FA/two-factor-auth.module';
import { OauthModule } from './features/user-managment/auth/oauth/oauth.module';
import { ConfigurationsModule } from './common/configurations/configurations.module';
import { postgressConfig } from './common/configurations/db.config';

@Module({
  imports: [TypeOrmModule.forRoot(
    postgressConfig
  ),

    UsersModule, AuthModule, TwoFactorAuthModule, OauthModule, ConfigurationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
