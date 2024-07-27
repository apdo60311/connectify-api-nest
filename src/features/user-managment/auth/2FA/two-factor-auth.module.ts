import { Module } from '@nestjs/common';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { JwtAuthModule } from '../jwt/jwt.module';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { UsersModule } from 'src/features/user-managment/users.module';

@Module({
    imports: [UsersModule, JwtAuthModule],
    controllers: [TwoFactorAuthController],
    providers: [TwoFactorAuthService, JwtStrategy],
    exports: [TwoFactorAuthModule]
})
export class TwoFactorAuthModule { }
