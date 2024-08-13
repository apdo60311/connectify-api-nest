import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/features/user-managment/users.module';
import { JwtAuthModule } from './jwt/jwt.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { TwoFactorAuthModule } from './2FA/two-factor-auth.module';
import { ConfigurationsModule } from 'src/common/configurations/configurations.module';
import { MailingModule } from 'src/common/mailing/mailing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginAttemptsEntity } from './entities/login-attempts.entity';
import { DeviceModule } from 'src/common/device-service/device.module';

@Module({
  imports: [UsersModule, JwtAuthModule, TwoFactorAuthModule, ConfigurationsModule, MailingModule, TypeOrmModule.forFeature([LoginAttemptsEntity]), DeviceModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
