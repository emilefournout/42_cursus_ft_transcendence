import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "src/user/dto/login-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private userService: AuthService) {}

  @Post("login")
  async loginUser(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser.username, loginUser.password);
  }

  @Get('qr-image')
  qrImage(@Query('user') user: string) {
    return this.userService.getQR(user)
  }

  @Get('set-2fa')
  set2FA(@Query('user') user: string, @Query('code') code: string) {
    return this.userService.set2FA(user, code)
  }
}
