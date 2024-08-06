import { Controller, Post, Body, Param, HttpStatus, ParseUUIDPipe, Session, HttpException, Put } from '@nestjs/common';
import { CreateUserDto } from 'src/features/user-managment/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 3, ttl: 300 } })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Session() session, @Body() createUserDto: CreateUserDto): Promise<Record<string, any>> {
    const accessToken = await this.authService.register(createUserDto);
    session.token = accessToken;
    return { code: HttpStatus.OK, message: "user created successfully", data: accessToken };
  }

  @Post('signin')
  async signin(@Session() session: Record<string, any>, @Body() loginDto: LoginDto): Promise<Record<string, any>> {
    const token = await this.authService.login(loginDto);
    session.token = token;
    return { code: HttpStatus.OK, message: "Logged in Successfully", data: token };
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
