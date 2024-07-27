import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/features/user-managment/users.module';
import { JwtAuthModule } from './jwt/jwt.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { TwoFactorAuthModule } from './2FA/two-factor-auth.module';
import { TwoFactorAuthController } from './2FA/two-factor-auth.controller';
import { ConfigurationsModule } from 'src/common/configurations/configurations.module';

@Module({
  imports: [UsersModule, JwtAuthModule, TwoFactorAuthModule, ConfigurationsModule.register({ stage: 'PRODUCTION' }),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
