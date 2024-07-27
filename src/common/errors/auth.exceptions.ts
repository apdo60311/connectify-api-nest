import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotFoundException extends HttpException {
    constructor(email?: string) {
        if (email) {
            super(`User with email ${email} not found`, HttpStatus.NOT_FOUND);
        } else {
            super(`User cannot found`, HttpStatus.NOT_FOUND)
        }
    }

}

export class InvalidCredentialsException extends HttpException {
    constructor() {
        super('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
}

export class TokenExpiredException extends HttpException {
    constructor() {
        super('Token has expired', HttpStatus.UNAUTHORIZED);
    }
}

export class UnsupportedAuthenticationMethod extends HttpException {
    constructor() {
        super('This method is not supported', HttpStatus.NOT_IMPLEMENTED);
    }
}

