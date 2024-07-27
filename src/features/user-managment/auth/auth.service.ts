import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/features/user-managment/users.service';
import { LoginDto } from './dto/login.dto';
import { InvalidCredentialsException, UserNotFoundException } from 'src/common/errors/auth.exceptions';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { compare } from "bcryptjs";
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { CreateUserDto } from 'src/features/user-managment/dto/create-user.dto';
import { User } from 'src/features/user-managment/entities/user.entity';
import { AccessTokenResponse } from './types/access-token.type';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) { }

    async login(login: LoginDto) {
        const user = await this.usersService.findOne({ email: login.email });
        if (!user) {
            throw new UserNotFoundException(login.email);
        }
        const passwordCorrect = await compare(login.password, user.password);


        if (!passwordCorrect) {
            throw new InvalidCredentialsException();
        }

        return this.generateToken(user)
    }

    async register(createUserDto: CreateUserDto): Promise<AccessTokenResponse> {
        const user = await this.usersService.create(createUserDto);
        return this.generateToken(user);
    }

    private generateToken(user: User,): AccessTokenResponse {
        const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return { access_token: accessToken };
    }
}

