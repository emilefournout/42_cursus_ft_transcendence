import * as bcrypt from 'bcrypt';
import { saltRounds } from 'src/auth/constants';
import { ForbiddenException, Injectable, NotAcceptableException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserBasicInfoDto } from './dto/info-user.dto';
import { use } from 'passport';
@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}

  async createUser(username: string, password: string, email: string, avatar: File) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt)
    try {
      await this.prisma.user.create({
        data: {
          username: username,
          password: hash,
          email: email
        }
      });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('There is a unique constraint violation, a new user cannot be created with this email');
          }
        }
    }
  }

  async findUserById(id: number) : Promise<User> {
    const user = await this.prisma.user.findUnique({
      where:{
        id: id
      }
    });
    return user;
  }

  async getUserInfoById(id: number)  : Promise<UserBasicInfoDto> {
    const userInfo = new UserBasicInfoDto()
    const user = await this.findUserById(id)
    if (user === null || user === undefined)
      return null
    userInfo.id = user.id;
    userInfo.username = user.username;
    userInfo.status = user.status;
    return userInfo;
  }
}
