import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as qrcode from "qrcode";
import { authenticator } from "otplib"

let tempSecret = ''

interface I42_oauth {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
  secret_valid_until: number;
}

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
            return this.signToken(user.id, user.username);
        } catch (error) {
            throw error;
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
        // TODO save tempSecret as secret in db
        return 'OK'
    }

  get42Token(code: string): Promise<string> {
    const formData = new FormData()
    formData.append('grant_type', 'authorization_code')
    formData.append('client_id', this.config.get('INTRA_UID'))
    formData.append('client_secret', this.config.get('INTRA_SECRET'))
    formData.append('code', code)
    formData.append('redirect_uri', this.config.get('REDIRECT_URI'))

    return fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then((data: I42_oauth) => data.access_token ?? 'No token')
      .catch(error => {
        console.log(error)
        return 'No token'
      })
  }
}
