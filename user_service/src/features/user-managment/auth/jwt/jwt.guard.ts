import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { jwtSecret } from "src/common/constants/secrets";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException();
        }
        const token = authHeader.split(" ")[1];
        try {
            const payload = this.jwtService.verify(token, { secret: jwtSecret });
            request.user = payload;
        } catch (err) {
            console.log(err);
            throw new UnauthorizedException();
        }
        return true;
    }
}