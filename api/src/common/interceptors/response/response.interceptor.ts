import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ServerResponse } from 'http';
import { map, Observable } from 'rxjs';
import { ResponseType } from 'src/common/types/response.type';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {


    return next.handle().pipe(map((data) => {
      // logger.info(data);
      return ResponseType.fromJson(data);
    }));
  }
}