import { Injectable } from '@nestjs/common';

@Injectable()
export class OauthService {
    handleRedirectLinkden() {
        return "handling redirect with linkden"
    }
    handleRedirectFacebook() {
        return "handling redirect with facebook"
    }
    handleRedirectGoogle() {
        return "handling redirect with google"
    }
    handleLoginWithLinkden() {
        return "oauth with linkden";
    }
    handleLoginWithFacebook() {
        return "oauth with facebook";
    }
    handleLoginWithGoogle() {
        return "oauth with google";
    }
}
