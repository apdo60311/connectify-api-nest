import { HttpException, HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export class UserNotFoundException extends RpcException {
    constructor(email?: string) {
        if (email) {
            super({ message: `User with email ${email} not found`, code: HttpStatus.NOT_FOUND });
        } else {
            super({ message: `User cannot found`, code: HttpStatus.NOT_FOUND })
        }
    }

}

export class UserAlreadyExistsException extends RpcException {
    constructor() {
        super({ message: 'User already exists', code: HttpStatus.CONFLICT })
    }
}


export class UserIsNotVerified extends RpcException {
    constructor(reason: string) {
        super({ message: reason, code: HttpStatus.FORBIDDEN });
    }
}

export class UserAlreadyVerifiedException extends RpcException {
    constructor() {
        super({ message: 'Email already verified', code: HttpStatus.BAD_REQUEST });
    }

}
export class VerificationEmailAlreadySentException extends RpcException {
    constructor() {
        super({ message: 'Verification email already sent', code: HttpStatus.BAD_REQUEST });
    }

}

export class InvalidCredentialsException extends RpcException {
    constructor() {
        super({ message: 'Invalid credentials', code: HttpStatus.UNAUTHORIZED });
    }
}

export class TokenExpiredException extends RpcException {
    constructor() {
        super({ message: 'Token has expired', code: HttpStatus.UNAUTHORIZED });
    }
}

export class UnsupportedAuthenticationMethod extends RpcException {
    constructor() {
        super({ message: 'This method is not supported', code: HttpStatus.NOT_IMPLEMENTED });
    }
}


export class TooManyAttempts extends RpcException {
    constructor() {
        super({ message: 'Too many login attempts. Please try again later.', code: HttpStatus.FORBIDDEN })
    }
}

export class InvalidToken extends RpcException {
    constructor() {
        super({ message: 'Invalid token', code: HttpStatus.BAD_REQUEST });
    }
}

export class EmailAlreadyExists extends RpcException {
    constructor() {
        super({ message: 'Email already verified', code: HttpStatus.BAD_REQUEST })
    }
}

export class FieldCannotBeEmpty extends RpcException {
    constructor(message: string) {
        super({ message, code: HttpStatus.BAD_REQUEST })
    }
}

export class FieldIsRequired extends RpcException {
    constructor(message: string) {
        super({ message, code: HttpStatus.BAD_REQUEST })
    }
}