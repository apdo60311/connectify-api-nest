import { Controller, Get, HttpStatus, UseGuards } from "@nestjs/common";
import { JwtCookieGuard } from "../user-managment/auth/guards/jwt-cookie.guard";


@UseGuards(JwtCookieGuard)
@Controller('profile')
export class UserProfileController {

    @Get('/')
    getProfile() {
        return { code: HttpStatus.OK, message: "Loaded sucessfully", data: "profile data" }
    }


}