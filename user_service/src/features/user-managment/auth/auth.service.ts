import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/features/user-managment/users.service';
import { LoginDto } from './dto/login.dto';
import { EmailAlreadyExists, InvalidCredentialsException, InvalidToken, TokenExpiredException, TooManyAttempts, UserAlreadyExistsException, UserAlreadyVerifiedException, UserIsNotVerified, UserNotFoundException, VerificationEmailAlreadySentException } from 'src/common/errors/auth.exceptions';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { CreateUserDto } from 'src/features/user-managment/auth/dto/create-user.dto';
import { User } from 'src/features/user-managment/entities/user.entity';
import { AccessTokenResponse } from './types/access-token.type';
import * as crypto from "crypto"
import { MailingService } from 'src/common/mailing/mailing.service';
import { getLoginAttemptsWarningEmailHtml, getResetPasswordMailHtml, getVerificationEmailHtml } from 'src/common/constants/strings';
import { Repository } from 'typeorm';
import { LoginAttemptsEntity } from './entities/login-attempts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { LoginAttemptStatus } from './enums/login-attempt-status.enum';
import { Request, Response } from 'express';
import { DeviceService } from 'src/common/device-service/device.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailingService: MailingService,
        @InjectRepository(LoginAttemptsEntity)
        private readonly loginAttemptsRepository: Repository<LoginAttemptsEntity>,
        private readonly configService: ConfigService,
        private readonly deviceService: DeviceService,
    ) { }

    async login(requestInfo: Record<string, any>, login: LoginDto) {

        const isBlocked = await this.detectSuspiciousAttempts(login, requestInfo);

        if (isBlocked) {
            throw new TooManyAttempts();
        }

        const user = await this.usersService.findOne({ email: login.email });

        if (!user) {
            throw new UserNotFoundException(login.email);
        }

        // check if user is not verified
        if (!user.isVerified) {
            await this.loginAttemptsRepository.save({ email: login.email, attemptStatus: LoginAttemptStatus.FAILURE });
            throw new UserIsNotVerified('User is not verified');
        }

        const passwordCorrect = await bcrypt.compare(login.password, user.password);

        if (!passwordCorrect) {
            await this.loginAttemptsRepository.save({ email: login.email, attemptStatus: LoginAttemptStatus.FAILURE });
            throw new InvalidCredentialsException();
        } else {
            // update login attempts
            await this.loginAttemptsRepository.delete({ email: login.email });
            await this.loginAttemptsRepository.save({ email: login.email, attemptStatus: LoginAttemptStatus.SUCCESS });
        }

        return this.generateToken(user);
    }

    private async detectSuspiciousAttempts(login: LoginDto, requestInfo: Record<string, any>) {
        const maxLoginAttempts: number = this.configService.get<number>('MAX_LOGIN_ATTEMPTS');
        const maxFailureLoginAttempts: number = this.configService.get<number>('MAX_FAILURE_LOGIN_ATTEMPTS');
        const loginBlockDuration: number = this.configService.get<number>('BLOCK_DURATION');

        const attempts = await this.loginAttemptsRepository.find({
            where: { email: login.email },
            order: { attemptDate: 'DESC' },
            take: maxLoginAttempts,
        });

        const faildAttemptsCount = attempts.filter((attempt: LoginAttemptsEntity) => attempt.attemptStatus == LoginAttemptStatus.FAILURE).length;

        if (faildAttemptsCount % maxFailureLoginAttempts == 0 && faildAttemptsCount != 0) {

            const deviceInfo = await this.deviceService.detectDevice(requestInfo);

            this.mailingService.sendEmail(login.email, 'Login Attempts', getLoginAttemptsWarningEmailHtml({ deviceInfo }));
        }

        const now = new Date().getTime();
        const isBlocked = attempts.length === maxLoginAttempts &&
            (now - new Date(attempts[attempts.length - 1].attemptDate).getTime()) < loginBlockDuration;
        return isBlocked;
    }

    async register(createUserDto: CreateUserDto): Promise<AccessTokenResponse> {

        const user = await this.usersService.findOne({ email: createUserDto.email });

        if (user) {
            throw new UserAlreadyExistsException();
        }

        const newUser = await this.usersService.create(createUserDto);
        await this.sendVerificationEmail(newUser);
        return this.generateToken(newUser);
    }

    async verifyEmail(token: string) {
        const user = await this.usersService.findOne({ verificationToken: token });
        if (!user) {
            throw new InvalidToken();
        }

        if (user.isVerified) {
            throw new EmailAlreadyExists();
        }

        console.log(Date.now());
        console.log(user.verificationExpires);
        if (user.verificationExpires < Date.now()) {
            throw new UserIsNotVerified('Verification token expired');
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationExpires = null;
        await this.usersService.update(user.id, user);
    }

    async requestResetPassword(email: string) {
        const user = await this.usersService.findOne({ email });
        if (!user) {
            throw new UserNotFoundException();
        }

        const token = this.generateRandomToken(20);
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
            throw new UserNotFoundException();
        }

        if (new Date(user.resetPasswordExpires) < new Date()) {
            throw new TokenExpiredException();
        }

        const isMatch: boolean = await bcrypt.compare(oldPassword, user.password)

        if (isMatch) {
            user.password = newPassword;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;

            await this.usersService.update(user.id, user);
        } else {
            throw new InvalidCredentialsException();
        }

    }


    async requestEmailVerification(email: string) {
        const user = await this.usersService.findOne({ email })

        if (!user) {
            throw new UserNotFoundException();
        }

        if (user.isVerified) {
            throw new UserAlreadyVerifiedException();
        }
        // if token not expired yet
        if (user.verificationExpires > Date.now()) {
            throw new VerificationEmailAlreadySentException();
        }
        return this.sendVerificationEmail(user);
    }

    private generateToken(user: User,): AccessTokenResponse {
        const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return { access_token: accessToken };
    }

    private generateRandomToken(length: number): string {
        return crypto.randomBytes(length).toString('hex')
    }


    private async sendVerificationEmail(user: User) {

        const token: string = this.generateRandomToken(20);
        const verificationDuration: number = this.configService.get<number>('EMAIL_VERIFICATION_DURATION');
        const verificationExpires = Date.now() + verificationDuration;


        await this.usersService.update(user.id, { isVerified: false, verificationToken: token, verificationExpires });

        const frontEndUrl: String = this.configService.get<string>('FRONT_END_URL');
        const VerificationLink: string = `${frontEndUrl}auth/verify/${token}`;

        this.mailingService.sendEmail(user.email, 'verification',
            getVerificationEmailHtml({ VerificationLink }));
    }

}

