import * as bcrypt from 'bcrypt';
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

    async login(username: string, password: string) {
        const user = await this.prisma.user.findFirst({
            where:{
                username: username,
            }
        });
        try{
            const verified:boolean = await bcrypt.compare(password, user.password);
            if (verified)
                return this.signToken(user.id, user.username);
            else
                throw new UnauthorizedException();
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
