import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interface/jwtpayload.dto';
import { UserService } from 'src/user/user.service';
import { UserServiceError } from 'src/user/exceptions/index.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.userService.findUserByFilter({ id: payload.sub });
      if (!user) throw new UnauthorizedException('Token id not valid');
      if (user.intraname != payload.intraname)
        throw new UnauthorizedException(
          'Username does not correspond to user identified by id'
        );
      return payload;
    } catch (error) {
      if (error instanceof UserServiceError.UserNotFoundException) {
        throw new UnauthorizedException('User does not exist');
      } else {
        throw error;
      }
    }
  }
}
