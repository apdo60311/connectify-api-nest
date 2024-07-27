import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { ResponseType } from 'src/common/types/response.type';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();

    response.status(status).send(ResponseType.fromJson({
      code: response.statusCode,
      message: exception.getResponse(),
      time: new Date().toISOString(),
      url: request.url,
    }).toJson());
  }
}
