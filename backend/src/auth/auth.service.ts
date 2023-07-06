import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor (private jwt : JwtService, private config: ConfigService) {}

    async signToken(userId: number, username: string) : Promise<{access_token: string}>
    {
        const payload = {sub: userId, username};
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '59m',
            secret: this.config.get('JWT_SECRET')
        })
        return {
            access_token: token,
        };
    }
}
