import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { JwtAuthGuard } from '../jwt/jwt.guard'

@Injectable()
export class JwtCookieGuard extends JwtAuthGuard {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        const token = request.signedCookies['jwt'].token.access_token
        if (token) {
            request.headers.authorization = `Bearer ${token}`
        }

        return super.canActivate(context)
    }
}
