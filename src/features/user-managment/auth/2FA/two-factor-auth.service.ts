import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { User } from 'src/features/user-managment/entities/user.entity';
import { UsersService } from 'src/features/user-managment/users.service';

@Injectable()
export class TwoFactorAuthService {
    constructor(private readonly userService: UsersService) { }

    async generateSecret(user: User) {
        if (user.isTwoFactorEnabled) {
            return { 'secret': user.twoFactorSecret };
        }
        const secret = speakeasy.generateSecret();
        await this.userService.updateSecretKey(user.id, secret.base32);

        return { 'secret': secret.base32 };
    }

    validateSecret(user: User, token: string): boolean {
        return speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token
        });
    }

}
