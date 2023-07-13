import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserBasicInfoDto } from './dto/info-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findUserByName(username: string) {
    const user = await this.prisma.user.findUnique({
      where:{
        username: username
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
    try {
      await this.prisma.user.delete({
      where: {
        id: id
      }
    })
    } catch(error) {
      throw new ForbiddenException('Could not delete user')
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto){
    const user = await this.findUserById(id)
    if(!user)
      throw new NotFoundException('User not found');
    await this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        username: updateUserDto.username
      }
    })
  }

  async addUserBlocked(id: number, target_id: number){
    const user = await this.findUserById(id)
    const target = await this.findUserById(target_id)
    if(!user || !target)
      throw new NotFoundException('User not found');
    try {
      await this.prisma.userBlocked.create({
        data: {
        user1_id: user.id,
        user2_id: target.id
      }})
    } catch(error) {
      throw new ForbiddenException('Could not create blocked user')
    }
  }

  async deleteUserBlocked(id: number, target_id: number){
    const user = await this.findUserById(id)
    const target = await this.findUserById(target_id)
    if(!user || !target)
      throw new NotFoundException('User not found');
    try {
      await this.prisma.userBlocked.delete({
        where: {
          user1_id_user2_id: {
            user1_id: user.id,
            user2_id: target.id
          }
        }
      })
    } catch(error) {
      throw new ForbiddenException('Could not remove blocked user')
    }
  }

//   await this.userService.addUserFriends(id, updateUserRelationDto);
//   await this.userService.acceptUserFriends(id, updateUserRelationDto);
//   await this.userService.declineUserFriends(id, updateUserRelationDto);

  async addUserFriends(id: number, target_id: number){
    const user = await this.findUserById(id)
    const target = await this.findUserById(target_id)
    if(!user || !target)
      throw new NotFoundException('User not found');
    try {
      await this.prisma.userFriendship.create({
        data: {
          requester_id: user.id,
          adressee_id: target.id
      }})
    } catch(error) {
      throw new ForbiddenException('Could not add friend')
    }
  }

  async acceptUserFriends(id: number, target_id: number) {
    const user = await this.findUserById(id)
    const target = await this.findUserById(target_id)
    if(!user || !target)
      throw new NotFoundException('User not found');
    const friendship = await this.prisma.userFriendship.findUnique({
      where: {
        requester_id_adressee_id : {
          requester_id: user.id,
          adressee_id: target.id
        }
      }
    })
    if(!friendship)
      throw new NotFoundException('Friendship not found');
    await this.prisma.userFriendship.update({
      where: {
        requester_id_adressee_id : {
          requester_id: user.id,
          adressee_id: target.id
        }
      },
      data: {
        status: 'ENABLED'
      }
    })
  }

  async declineUserFriends(id: number, target_id: number) {
    const user = await this.findUserById(id)
    const target = await this.findUserById(target_id)
    if(!user || !target)
      throw new NotFoundException('User not found');
    const friendship = await this.prisma.userFriendship.findUnique({
      where: {
        requester_id_adressee_id : {
          requester_id: user.id,
          adressee_id: target.id
        }
      }
    })
    if(!friendship)
      throw new NotFoundException('Friendship not found');
    try {
      await this.prisma.userFriendship.delete({
        where: {
          requester_id_adressee_id: {
            requester_id: user.id,
            adressee_id: target.id
          }
        }
      })
    } catch(error) {
      throw new ForbiddenException('Could not delete friendship user')
    }
  }
}
