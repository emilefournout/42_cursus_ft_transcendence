import { Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { Response, Express, Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private userService: AuthService) {}

  @Post("login")
  @UseInterceptors(FileInterceptor('image'))
  async loginUser(@Req() request: Request, @Body() loginUser: LoginUserDto, @UploadedFile() image?: Express.Multer.File) {
    const token = extractTokenFromRequest(request)
    console.log('Check 42token here', token) // TODO Check 42token
    if (!token) {
      throw new UnauthorizedException()
    }
    return this.userService.login(loginUser.username);
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
    return res.cookie('42token', token).redirect('http://localhost:8000/welcome')
  }
}

function extractTokenFromRequest(request) {
  return request.header('Authorization') && request.header('Authorization').split(' ').length > 1 ?
    request.header('Authorization').split(' ')[1] : '';
}

