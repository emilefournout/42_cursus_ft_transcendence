import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { VerifyUserDto } from "src/user/dto/verify-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private userService: AuthService) {}

  @Post("login")
  async loginUser(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser.username);
  }

  @Post("verify-2fa")
  async verifyUser(@Body() verifyUser: VerifyUserDto) {
    return this.userService.verifyTwoFactorAuthentication(verifyUser.id, verifyUser.code);
  }

  @Get('qr-image')
  qrImage(@Query('user') user: string) {
    return this.userService.getQR(user)
  }

  @Get('set-2fa')
  set2FA(@Query('user') user: string, @Query('code') code: string) {
    return this.userService.set2FA(user, code)
  }

  @Get('42token')
  async get42Token(@Query('code') code: string): Promise<string> {
    if (!code) {
      return 'No code'
    }
    return await this.userService.get42Token(code)
  }
}
