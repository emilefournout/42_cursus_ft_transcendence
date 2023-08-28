import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interface/jwtpayload.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt')
{
    constructor(
        private configService: ConfigService,
        private userService: UserService)
        {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findUserById(payload.sub)
        if (!user) 
            throw new UnauthorizedException('Token id not valid')
        if (user.intraname != payload.intraname) 
            throw new UnauthorizedException('Username does not correspond to user identified by id');
        return payload
    }
}