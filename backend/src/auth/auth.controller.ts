import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { Response } from "express";

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

  @Get('42token')
  async get42Token(@Res() res: Response, @Query('code') code: string): Promise<void> {
    const token = await this.userService.get42Token(code)
    if (token == 'No token') {
      return res.clearCookie('42token').redirect('http://localhost:8000')
    }
    // TODO Save the token to check the user later. Maybe put our jwt token.
    return res.cookie('42token', token).redirect('http://localhost:8000/welcome')
  }
}
