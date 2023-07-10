import * as bcrypt from 'bcrypt';
import { saltRounds } from 'src/auth/constants';
import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserBasicInfoDto } from './dto/info-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { UpdateUserDto } from './dto/update-user.dto';

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
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('There is a unique constraint violation, a new user cannot be created with this email');
          }
        }
    }
  }

  async findUserById(id: number) {
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

  async deleteUser(id: number) {
    await this.prisma.user.delete({
      where: {
        id: id
      }
    })
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto){
    const user = await this.findUserById(id)
    if (user === null || user === undefined)
      throw new NotFoundException('User not found');
    Object.assign(user, updateUserDto)
    await this.prisma.user.update({
      where: {
        id: id
      },
      data: user
    })
  }
}
