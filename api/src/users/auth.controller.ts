import { Body, Controller, Get, HttpException, Inject, Param, Post, Put, Req, Res } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { LoginDto } from "./dtos/login.dto";
import { catchError, Observable, throwError, timeout } from "rxjs";
import { Request, response } from "express";


@Controller('auth')
export class AuthController {

    constructor(@Inject('NATS_SERVICE') private readonly natsClient: ClientProxy) { }

    @Post('signup')
    signup(@Body() createUserDto: CreateUserDto) {
        // return this.natsClient.emit('register', createUserDto)
        //     .pipe(catchError(error => throwError(() => new HttpException(error.message, error.code))));
        return this.natsClient.emit('register', createUserDto).pipe(
            catchError((error) => {
                if (error instanceof RpcException) {
                    throw new HttpException(error.message, 500);
                }
                console.log(error);
                throw new HttpException(error.message, error.code);
            })
        );
    }


    @Post('signin')
    signin(@Req() request: Request, @Res() response: Response, @Body() loginDto: LoginDto) {
        return this.natsClient.send({ cmd: 'login' }, { requestInfo: { ip: request.ip, "headers": request.headers }, response: {}, loginDto })
            .pipe(catchError(error => throwError(() => new HttpException(error.message, error.code))));
    }


    @Post('request-verification-email')
    async requestVerificationEmail(@Body() body: Record<string, any>) {
        const reponse: Observable<any> = this.natsClient.emit('request-verification-email', body).pipe(
            timeout(5000),
            catchError((error) => {
                if (error instanceof RpcException) {
                    throw new HttpException(error.message, 500);
                }
                throw new HttpException(error.message, error.code);
            })
        );

        const result = await response.toPromise();

        if (response.s) {

        }
    }

    @Get('verify/:token')
    async verifyEmail(@Param('token') token: string) {
        return this.natsClient.send({ cmd: 'verify-email' }, token).pipe(catchError(error => throwError(() => new HttpException(error.message, error.code))));
    }

    @Post('logout')
    async logout(@Res() response: Response) {
        return this.natsClient.send({ cmd: 'logout' }, response);
    }

    @Post('request-reset-password')
    async requestResetPassword(@Body() body: Record<string, any>) {
        return this.natsClient.emit('request-reset-password', body);
    }

    @Put('reset-password/:token')
    async resetPassword(@Param('token') token: string, @Body() body: Record<string, any>) {
        return this.natsClient.send({ cmd: 'reset-password' }, { token, body });
    }

}
