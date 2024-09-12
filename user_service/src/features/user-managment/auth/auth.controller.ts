import { Controller, Post, Body, Param, HttpStatus, HttpException, Put, Req, Res, Get, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/features/user-managment/auth/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices"
import { SigninPayload } from './types/signin-payload.type';
import { FieldCannotBeEmpty, FieldIsRequired } from 'src/common/errors/auth.exceptions';
// @Throttle({ default: { limit: 3, ttl: 300 } })
// @UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) { }

  @EventPattern('register')
  async signup(@Payload() createUserDto: CreateUserDto): Promise<Record<string, any>> {
    console.log('registering user');
    await this.authService.register(createUserDto);
    const frontEndUrl = this.configService.get<string>('FRONT_END_URL');
    return {
      code: HttpStatus.OK, message: "user created successfully",
      links: [
        { login: `${frontEndUrl}auth/sigin` },
        { sendVerificationEmail: `${frontEndUrl}auth/request-verification-email` }
      ]
    };
  }

  @MessagePattern({ cmd: 'login' })
  async signin(@Payload() payload: SigninPayload): Promise<Record<string, any>> {
    const token = await this.authService.login(payload.requestInfo, payload.loginDto);
    // payload.response.cookie('jwt', { token }, {
    //   httpOnly: true,
    //   secure: this.configService.get<string>('NODE_ENV') === 'production',
    //   sameSite: 'strict',
    //   signed: true,
    //   maxAge: 3600000
    // });

    // return payload.response.json({ code: HttpStatus.OK, message: "Logged in Successfully", data: {} });
    return { code: HttpStatus.OK, message: "Logged in Successfully", data: {} };
  }


  //TODO:  
  @EventPattern('request-verification-email')
  async requestVerificationEmail(@Body() body: Record<string, any>) {
    const email = body.email;
    if (!email) {
      throw new FieldIsRequired("Email is Required");
    }
    await this.authService.requestEmailVerification(email);
    return { code: HttpStatus.OK, message: "Verification email sent successfully" };
  }

  @MessagePattern({ cmd: 'verify-email' })
  async verifyEmail(@Payload() token: string) {
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
      throw new FieldCannotBeEmpty('Email cannot be empty');
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
      throw new FieldCannotBeEmpty('Old Password and New Password cannot be empty');
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
