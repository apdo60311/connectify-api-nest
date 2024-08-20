import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => {
      if (data && typeof data === 'object') {
        this.removePassword(data);
      }
      return data;
    }));
  }

  private removePassword(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach(item => this.removePassword(item));
    } else if (obj && typeof obj === 'object') {
      delete obj.password;
      Object.values(obj).forEach(value => {
        if (typeof value === 'object') {
          this.removePassword(value);
        }
      });
    }
  }

}
