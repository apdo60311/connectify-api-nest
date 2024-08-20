import { Body, Controller, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users.service';

@Controller('auth/2fa')
export class TwoFactorAuthController {
    constructor(private readonly twoFactorAuthService: TwoFactorAuthService, private readonly userService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Post('generate')
    async generateTwoFactorSecret(@Request() req) {
        try {
            const otpauthUrl = await this.twoFactorAuthService.generateSecret(req.user);
            return { code: HttpStatus.OK, message: "Oauth secret generated successfully", data: otpauthUrl }


        } catch (error) {
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('verify')
    async verifyTwoFactorToken(@Request() req, @Body() body) {

        try {
            const user = await this.userService.findOne({ id: req.user.id })
            const isValid = this.twoFactorAuthService.validateSecret(user, body.token);
            if (!isValid) {
                return { message: 'Invalid token' };
            }

        } catch (error) {
            return { message: 'Error occured' };
        }

        return { message: '2FA enabled successfully' };
    }
}
