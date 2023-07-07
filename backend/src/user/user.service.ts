const bcrypt = require('bcrypt');
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserBasicInfoDto } from './dto/info-user.dto';
import { use } from 'passport';
@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}

  async createUser(username: string, password: string, email: string, avatar: File) {
    await this.prisma.user.create({
      data: {
        username: username,
        password: password, // To be Hashed
        email: email
      }
    })
  }

  async findUserById(id: number) : Promise<User>{
    const user = await this.prisma.user.findUnique({
      where:{
        id: id
      }
    });
    return user;
  }

  async getUserInfoById(id: number) {
    const userInfo = new UserBasicInfoDto()
    const user = await this.prisma.user.findUnique({
      where:{
        id: id
      }
    });
    if (user === null || user === undefined)
      return null
    userInfo.id = user.id;
    userInfo.username = user.username;
    userInfo.status = user.status;
    return userInfo;
  }
}
