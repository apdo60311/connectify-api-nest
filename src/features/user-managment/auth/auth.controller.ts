import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, ParseIntPipe, ParseUUIDPipe, Req, Session, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/features/user-managment/dto/create-user.dto';
import { User } from 'src/features/user-managment/entities/user.entity';
import { UsersService } from 'src/features/user-managment/users.service';
import { LoginDto } from './dto/login.dto';
import { compare } from "bcryptjs"
import { AuthService } from './auth.service';
import { ResponseType } from 'src/common/types/response.type';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { JwtAdminGaurd } from './jwt/jwt-admin.guard';
import { AccessTokenResponse } from './types/access-token.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Session() session, @Body() createUserDto: CreateUserDto): Promise<Record<string, any>> {
    const accessToken = await this.authService.register(createUserDto);
    session.token = accessToken;
    return { code: HttpStatus.OK, message: "user created successfully", data: accessToken };
  }

  @Post('signin')
  async signin(@Session() session: Record<string, any>, @Body() loginDto: LoginDto): Promise<Record<string, any>> {
    const user: User = await this.usersService.findOne({ email: loginDto.email });
    if (user) {
      const isMatch = await compare(loginDto.password, user.password);
      if (isMatch) {
        const token = await this.authService.login(loginDto);
        session.token = token;

        return {
          code: HttpStatus.OK, message: "Logged in Successfully", data: token
        };
      } else {
        return { code: HttpStatus.UNAUTHORIZED, message: "Invalid Credentials" };
      }
    }
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(): string {
    return "profile";
  }

  @UseGuards(JwtAdminGaurd)
  @Post('ban-user/:id')
  banUser(@Param('id', new ParseUUIDPipe()) id) {
    return `user with id = ${id} is banned`;
  }
}
