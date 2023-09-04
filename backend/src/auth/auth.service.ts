import * as argon2 from 'argon2';
import * as jdenticon from 'jdenticon';
import * as fs from 'fs';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as qrcode from 'qrcode';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';
import { TwoFactorAuthenticationStatus } from '@prisma/client';
import { I42_oauth } from './interface/I42_oauth';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  async signToken(userId: number, intraname: string): Promise<string> {
    const payload = { sub: userId, intraname };
    return this.jwtService.sign(payload);
  }

  async register(
    intraname: string,
    username: string,
    avatarURL: string,
    code2fa: string
  ) {
    let user = await this.userService.findUserByName(username);
    if (!user) {
      user = await this.userService.createUser(intraname, username, avatarURL);
    }
    const tfa = await this.prisma.twoFactorAuthentication.findFirst({
      where: { user_id: user.id }
    });

    // Check code2fa if needed
    if (
      tfa &&
      tfa.status === TwoFactorAuthenticationStatus.ENABLED &&
      code2fa &&
      !authenticator.check(code2fa, tfa.twoFactorAuthenticationSecret)
    ) {
      throw new UnauthorizedException();
    }

    let access_token = await this.signToken(user.id, user.intraname);
    // Send access_token = null if not code2fa and needed
    if (
      tfa &&
      tfa.status === TwoFactorAuthenticationStatus.ENABLED &&
      !code2fa
    ) {
      access_token = null;
    }
    return { access_token, id: user.id, username: user.username };
  }

  async login(username: string) {
    const user = await this.userService.findUserByName(username);
    const access_token = await this.signToken(user.id, user.intraname);
    return { access_token, id: user.id, username: user.username };
  }

  async getQR(username: string) {
    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(username, 'Pong', secret);
    const image = await qrcode.toDataURL(uri);

    const user = await this.userService.findUserByName(username);
    await this.prisma.twoFactorAuthentication.deleteMany({
      where: { user_id: user.id }
    });
    await this.prisma.twoFactorAuthentication.create({
      data: {
        user_id: user.id,
        status: TwoFactorAuthenticationStatus.PENDING,
        twoFactorAuthenticationSecret: secret
      }
    });
    return image;
  }

  async set2FA(username: string, code: string) {
    const user = await this.userService.findUserByName(username);
    const tfa = await this.prisma.twoFactorAuthentication.findFirst({
      where: { user_id: user.id }
    });
    if (!tfa) throw new UnauthorizedException();
    const verified = authenticator.check(
      code,
      tfa.twoFactorAuthenticationSecret
    );
    if (!verified) throw new UnauthorizedException();
    await this.prisma.twoFactorAuthentication.update({
      where: { user_id: user.id },
      data: { status: TwoFactorAuthenticationStatus.ENABLED }
    });
    return 'OK';
  }

  async refreshToken() {
    return;
  }

  get42Token(code: string): Promise<string> {
    return fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      body: this.authTokenFormData(code)
    })
      .then((response) => response.json())
      .then((data: I42_oauth) => data.access_token ?? null)
      .catch(() => {
        return null;
      });
  }

  async getIntraLogin(token: string) {
    const response = await fetch('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.status > 400) throw new Error('Access token is invalid');
    return data['login'];
  }

  private authTokenFormData(code: string) {
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('client_id', this.config.get('INTRA_UID'));
    formData.append('client_secret', this.config.get('INTRA_SECRET'));
    formData.append('code', code);
    formData.append('redirect_uri', this.config.get('REDIRECT_URI'));
    return formData;
  }
}
