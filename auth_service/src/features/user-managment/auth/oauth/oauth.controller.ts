import { Controller, Get, Param } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { UnsupportedAuthenticationMethod } from 'src/common/errors/auth.exceptions';
import { OauthType } from './types/oauth.type';

@Controller('oauth')
export class OauthController {
    constructor(private readonly oauthService: OauthService) { }

    @Get(':type')
    handleLogin(@Param('type') oauthType: OauthType) {

        switch (oauthType) {
            case OauthType.Google:
                return this.oauthService.handleLoginWithGoogle();
            case OauthType.Facebook:
                return this.oauthService.handleLoginWithFacebook();
            case OauthType.Linkden:
                return this.oauthService.handleLoginWithLinkden();
            default:
                throw new UnsupportedAuthenticationMethod()
        }
    }

    @Get(':type/redirect')
    handleRedirect(@Param('type') oauthType: OauthType) {
        switch (oauthType) {
            case OauthType.Google:
                return this.oauthService.handleRedirectGoogle()
            case OauthType.Facebook:
                return this.oauthService.handleRedirectFacebook()
            case OauthType.Linkden:
                return this.oauthService.handleRedirectLinkden()
            default:
                throw new UnsupportedAuthenticationMethod()
        }
    }


}

