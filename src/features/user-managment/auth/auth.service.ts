import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/features/user-managment/users.service';
import { LoginDto } from './dto/login.dto';
import { InvalidCredentialsException, UserNotFoundException } from 'src/common/errors/auth.exceptions';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { compare } from "bcryptjs";
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { CreateUserDto } from 'src/features/user-managment/dto/create-user.dto';
import { User } from 'src/features/user-managment/entities/user.entity';
import { AccessTokenResponse } from './types/access-token.type';
import * as crypto from "crypto"
import { MailingService } from 'src/common/mailing/mailing.service';
import { getResetPasswordMailHtml } from 'src/common/constants/strings';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService, private readonly mailingService: MailingService) { }

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

    async requestResetPassword(email: string) {
        const user = await this.usersService.findOne({ email });
        if (!user) {
            throw new HttpException('Email Not Found', HttpStatus.BAD_REQUEST);
        }

        const token = crypto.randomBytes(20).toString('hex')
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);

        this.usersService.update(user.id, user)

        const message = getResetPasswordMailHtml({ token });

        this.mailingService.sendEmail(user.email, "reset password", message).catch((err) => {
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;

            this.usersService.update(user.id, user)

        })
    }

    async resetPassword(token: string, oldPassword: string, newPassword: string) {

        const user = await this.usersService.findOne({ resetPasswordToken: token, })

        if (!user) {
            throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
        }

        if (new Date(user.resetPasswordExpires) < new Date()) {
            throw new HttpException('Token expired', HttpStatus.NOT_FOUND);
        }

        const isMatch: boolean = await compare(oldPassword, user.password)

        if (isMatch) {
            user.password = newPassword;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;

            await this.usersService.update(user.id, user);
        } else {
            throw new InvalidCredentialsException();
        }

    }

    private generateToken(user: User,): AccessTokenResponse {
        const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return { access_token: accessToken };
    }


}

