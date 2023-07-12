import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserBasicInfoDto } from './dto/info-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { UpdateUserDto, UpdateUserRelationDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}

  async createUser(username: string, avatar: File) {
    try {
      await this.prisma.user.create({
        data: {
          username: username,
        }
      });
      return true;
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2002') {
            throw new ForbiddenException('There is a unique constraint violation, a new user cannot be created with this email');
          }
        }
        return false;
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
    if (!user)
      throw new NotFoundException('User not found');
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
    function checkNullUser(user, returnError) {
      if(user === null || user == undefined)
        throw new NotFoundException(returnError);
      return user;
    }

    const user = checkNullUser(await this.findUserById(id), 'User not found');
    if(updateUserDto.friend === null || updateUserDto.blocked === null)
      throw new BadRequestException({message: `${updateUserDto.friend === null ? 'friend' : 'blocked'} must be an object`,
      error: "Bad Request", 
      statusCode: 400});
    if(updateUserDto.friend !== undefined)
      checkNullUser(await this.findUserById(updateUserDto.friend.id), 'Target user not found')
    if(updateUserDto.blocked !== undefined)
      checkNullUser(await this.findUserById(updateUserDto.blocked.id), 'Target user not found')

    //Object.assign(user, updateUserDto)
    //await this.prisma.user.update({
    //  where: {
    //    id: id
    //  },
    //  data: user
    //})
  }
}
