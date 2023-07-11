import { Body, Controller, Post } from "@nestjs/common";
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
}
