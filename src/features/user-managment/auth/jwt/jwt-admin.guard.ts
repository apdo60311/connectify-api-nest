import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { jwtSecret } from "src/common/constants/secrets";
import { UserRole } from "src/common/enums/user-role.enum";
import { JwtPayload } from "src/common/types/jwt-payload.type";

@Injectable()
export class JwtAdminGaurd implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException();
        }
        const token = authHeader.split(' ')[1];
        try {
            const payload = this.jwtService.verify(token, { secret: jwtSecret });
            request.user = payload;
        } catch (err) {
            throw new UnauthorizedException(err);
        }
        return request.user.role == UserRole.ADMIN;

    }

}