import { MiddlewareConsumer, Module, NestModule, Post } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './features/user-managment/users.module';
import { AuthModule } from './features/user-managment/auth/auth.module';
import { TwoFactorAuthModule } from './features/user-managment/auth/2FA/two-factor-auth.module';
import { OauthModule } from './features/user-managment/auth/oauth/oauth.module';
import { ConfigurationsModule } from './common/configurations/configurations.module';
import { typeOrmAsyncOptions } from './common/configurations/config';
import { MailingModule } from './common/mailing/mailing.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserProfileModule } from './features/user-profile/user-profile.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigurationsModule,
    TypeOrmModule.forRootAsync(
      typeOrmAsyncOptions
    ),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL_LONG'),
          limit: config.get('THROTTLE_LIMIT_LONG'),
        },
      ],
    }), PassportModule.register({ session: true }),
    UsersModule,
    AuthModule,
    TwoFactorAuthModule,
    OauthModule,
    MailingModule,
    UserProfileModule,],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
