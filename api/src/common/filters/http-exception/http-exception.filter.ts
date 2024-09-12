import { ArgumentsHost, Catch, ExceptionFilter, HttpException, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { ResponseType } from 'src/common/types/response.type';

@Catch()
export class HttpExceptionFilter implements HttpExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {

    console.log(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;


    // logger.error(exception);

    response.status(status).send(ResponseType.fromJson({
      code: response.statusCode,
      message: exception instanceof HttpException ? exception.getResponse() : "Internal Error",
      time: new Date().toISOString(),
      url: request.url,
    }).toJson());
  }
}
