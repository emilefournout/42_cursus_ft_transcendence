import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as qrcode from "qrcode";
import { authenticator } from "otplib"

let tempSecret = ''

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

    async getQR(user: string) {
        const secret = authenticator.generateSecret()
        const uri = authenticator.keyuri(user, 'Pong', secret)
        const image = await qrcode.toDataURL(uri)
        tempSecret = secret // TODO save in database with the user
        return image
    }

    async set2FA(user: string, code: string) {
        const verified = authenticator.check(code, tempSecret)
        if (!verified)
            throw new UnauthorizedException()
        // save tempSecret as secret in db
        return 'OK'
    }
}
