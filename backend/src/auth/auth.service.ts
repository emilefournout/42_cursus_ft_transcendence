import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor (private jwt : JwtService, private config: ConfigService, private prisma: PrismaService) {}

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

    async login(username: string) {
        const user = await this.prisma.user.findFirst({
            where:{
                username: username,
            }
        });
        try {
            // const verified:boolean = await argon2.verify(user.password, password);
            const verified = true;
            if (!verified)
                throw new UnauthorizedException();
            if (user.istwoFactorAuthenticationEnabled) {

            }
            return this.signToken(user.id, user.username);
        } catch (error) {
            throw error;
        }
    }

    async verifyTwoFactorAuthentication(id: number, code: string) {
        
    }
}
