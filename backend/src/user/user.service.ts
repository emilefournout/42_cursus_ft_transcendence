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
            throw new ForbiddenException('There is a unique constraint violation, a new user cannot be created with this username');
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

  async addUserBlocked(userId: number, targetId: number){
    const user = await this.findUserById(userId)
    const target = await this.findUserById(targetId)
    if(!user || !target)
      throw new NotFoundException('User not found');
    try {
      await this.prisma.userBlocked.create({
        data: {
        user1_id: userId,
        user2_id: targetId
      }})
    } catch(error) {
      throw new ForbiddenException('Could not create blocked user')
    }
  }

  async deleteUserBlocked(userId: number, blockedId: number){
    try {
      await this.prisma.userBlocked.delete({
        where: {
          user1_id_user2_id: {
            user1_id: userId,
            user2_id: blockedId
          }
        }
      })
    } catch(error) {
      throw new ForbiddenException('Could not remove blocked user')
    }
  }

  async addUserFriends(requester_id: number, adressee_id: number){
    const requester = await this.findUserById(requester_id)
    const adressee = await this.findUserById(adressee_id)
    if(!requester || !adressee)
      throw new NotFoundException('User not found');
    const friendship = await this.findFriendShipByIds(adressee_id, requester_id);
    if(friendship)
      throw new ForbiddenException('Friendship pending')
    try {
      await this.prisma.userFriendship.create({
        data: {
          requester_id: requester_id,
          adressee_id: adressee_id
      }})
    } catch(error) {
      throw new ForbiddenException('Could not add friend')
    }
  }

  private async findFriendShipByIds(requester_id: number, adressee_id: number){
    const friendship = await this.prisma.userFriendship.findUnique({
      where: {
        requester_id_adressee_id : {
          requester_id: requester_id,
          adressee_id: adressee_id
        }
      }
    });
    return friendship;
  }

  async acceptUserFriends(adressee_id: number, requester_id: number) {
    const friendship = await this.findFriendShipByIds(requester_id, adressee_id)
    if(!friendship)
      throw new NotFoundException('Friendship not found');
    else if(friendship.status === 'ENABLED')
      throw new ForbiddenException('Friend alredy accepted');
    await this.prisma.userFriendship.update({
      where: {
        requester_id_adressee_id : {
          requester_id: requester_id,
          adressee_id: adressee_id
        }
      },
      data: {
        status: 'ENABLED'
      }
    })
  }

  async declineUserFriends(adressee_id: number, requester_id: number) {
    const friendship = await this.findFriendShipByIds(requester_id, adressee_id);
    const request = await this.findFriendShipByIds(adressee_id, requester_id);
    if(!friendship && !request)
      throw new NotFoundException('Friendship not found');
    if(!friendship)
      [requester_id, adressee_id] = [adressee_id, requester_id]
    try {
      await this.prisma.userFriendship.delete({
        where: {
          requester_id_adressee_id: {
            requester_id: requester_id,
            adressee_id: adressee_id
          }
        }
      })
    } catch(error) {
      throw new ForbiddenException('Could not delete friendship user')
    }
  }
}
