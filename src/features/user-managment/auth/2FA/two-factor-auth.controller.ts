import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { AuthService } from '../auth.service';

@Controller('auth/two-factor-auth')
export class TwoFactorAuthController {
    constructor(private readonly twoFactorAuthService: TwoFactorAuthService) { }

    @UseGuards(JwtAuthGuard)
    @Post('2fa/generate')
    async generateTwoFactorSecret(@Request() req) {
        const otpauthUrl = await this.twoFactorAuthService.generateSecret(req.user);
        return otpauthUrl;
    }

    @UseGuards(JwtAuthGuard)
    @Post('2fa/verify')
    async verifyTwoFactorToken(@Request() req, @Body() body) {
        try {
            const isValid = this.twoFactorAuthService.validateSecret(req.user, body.token);
            if (!isValid) {
                return { message: 'Invalid token' };
            }

        } catch (error) {
            return { message: 'Error occured' };
        }

        return { message: '2FA enabled successfully' };
    }
}
