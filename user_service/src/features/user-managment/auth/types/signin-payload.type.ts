import { LoginDto } from "../dto/login.dto"

export type SigninPayload = {
    requestInfo: Record<string, any>,
    loginDto: LoginDto,
}