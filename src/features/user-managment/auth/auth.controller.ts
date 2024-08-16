import { Controller, Post, Body, Param, HttpStatus, ParseUUIDPipe, Session, HttpException, Put, Req, Res, Get, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/features/user-managment/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Throttle({ default: { limit: 3, ttl: 300 } })
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) { }

  @Post('signup')
  async signup(@Session() session, @Body() createUserDto: CreateUserDto): Promise<Record<string, any>> {
    const accessToken = await this.authService.register(createUserDto);
    session.token = accessToken;
    return { code: HttpStatus.OK, message: "user created successfully", data: accessToken };
  }

  @Post('signin')
  async signin(@Req() request: Request, @Res() response: Response, @Body() loginDto: LoginDto): Promise<Record<string, any>> {
    const token = await this.authService.login(request, loginDto);
    response.cookie('jwt', { token }, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      signed: true,
      maxAge: 3600000
    });

    return response.json({ code: HttpStatus.OK, message: "Logged in Successfully", data: {} });
  }


  @Post('request-verification-email')
  async requestVerificationEmail(@Body() body: Record<string, any>) {
    const email = body.email;
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    await this.authService.requestEmailVerification(email);
    return { code: HttpStatus.OK, message: "Verification email sent successfully" };
  }

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string) {
    await this.authService.verifyEmail(token);
    return { code: HttpStatus.OK, message: "Email verified successfully" };
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    response.clearCookie('jwt', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict'
    })
    return response.json({ code: HttpStatus.OK, message: "Logged out successfully", data: {} });
  }

  @Post('request-reset-password')
  async requestResetPassword(@Body() body: Record<string, any>) {
    const email = body.email;
    if (!email) {
      throw new HttpException('Email cannot be empty', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.authService.requestResetPassword(email);
      return { code: HttpStatus.OK, message: "Password Reset Email sent successfully" }

    } catch (error) {
      throw error;
    }

  }

  @Put('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() body: Record<string, any>) {
    const { oldPassword, newPassword } = body;
    if (!oldPassword || !newPassword) {
      throw new HttpException('Old Password and New Password cannot be empty', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.authService.resetPassword(token, oldPassword, newPassword);
      return { code: HttpStatus.OK, message: "password updated successfully" }

    } catch (error) {
      throw error;
    }

  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(): string {
  //   return "profile";
  // }

  // @UseGuards(JwtAdminGaurd)
  // @Post('ban-user/:id')
  // banUser(@Param('id', new ParseUUIDPipe()) id) {
  //   return `user with id = ${id} is banned`;
  // }
}
