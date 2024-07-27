import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "src/common/constants/secrets";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: jwtSecret,
            signOptions: {
                expiresIn: '1d',
            }
        }),
    ],
    exports: [JwtAuthModule]
})
export class JwtAuthModule { }