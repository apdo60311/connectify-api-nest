import { Module } from "@nestjs/common";
import { UserProfileController } from "./user-profile.controller";

@Module({
    imports: [],
    controllers: [UserProfileController],
    providers: [],
    exports: []
})
export class UserProfileModule { }