import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserBasicInfoDto } from './dto/info-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignAchievementDto } from './dto/assign-achievement.dto';
import { url } from 'inspector';
import { OnlineStatus, Prisma } from '@prisma/client';
import { GameService } from 'src/game/game.service';
import { ScoreField } from './types/scorefield.enum';
import { UserServiceErrors } from './exceptions/user-service.exception';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
    private gameService: GameService) {}

  async createUser(intraname: string, username: string, avatar: string) {
    try {
      const user = await this.prisma.user.create({
        data: {
          intraname: intraname,
          username: username,
          avatarURL: avatar
        }
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UserServiceErrors.UsernameExistsException();
        }
      }
      throw new error;
    }
  }

  async findUserById(id: number) {
    const user = await this.prisma.user.findFirst({
      where:{
        id: id
      }
    });
    return user;
  }

  async findUserByName(username: string) {
    const user = await this.prisma.user.findFirst({
      where:{
        username: username
      }
    });
    return user;
  }

  async findUserByIntraname(intraname: string) {
    const user = await this.prisma.user.findFirst({
      where:{
        intraname: intraname
      }
    });
    return user;
  }

  async getUserInfoById(id: number)  : Promise<UserBasicInfoDto> {
    const user = await this.findUserById(id)
    if (!user)
      return null;
    const userInfo = UserBasicInfoDto.fromUser(user)
    if (user.status == OnlineStatus.PLAYING)
      userInfo.currentGame = this.gameService.findActiveGameByUserId(user.id);
    return userInfo
  }

  async getUserInfoByName(username: string){
    const user = await this.prisma.user.findUnique({
      where: {
        username: username
      }
    })
    if(!user)
      throw new NotFoundException('User not found')
    return UserBasicInfoDto.fromUser(user);
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.$transaction(async () => {
      await this.prisma.message.updateMany({
        where: {
          userId: userId
        },
        data: {
          userId: 1
        }
      })
      return await this.prisma.user.delete({
        where: {
          id: userId
        }
      })
    })
    return user;
  }

  async updateUsername(id: number, newUsername: string){
    const user = await this.findUserById(id);
    if (!user)
      return null;
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: id
        },
        data: {
          username: newUsername
        }
      })
      return updatedUser;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new UserServiceErrors.UsernameExistsException();
        }
      }
      throw e
    }
  }
  
  async updateScore(userId: number, field: ScoreField) {
    const updateField = field === ScoreField.Wins ? { wins: { increment: 1 } } : { loses: { increment: 1 } };
  
    return await this.prisma.user.update({
      where: { id: userId },
      data: updateField,
    });
  }
 

  async getRanking() {
    const users = await this.prisma.user.findMany({
      where: {
        NOT: {
          id: 1
        }
      },
      orderBy: {
        wins: 'desc'
      },
      take: 10
    })
    return users.map((chat) => UserBasicInfoDto.fromUser(chat));
  }

  async getUserHistory(id: number) {
    const user = await this.findUserById(id);
    if(!user)
      throw new UserServiceErrors.UserNotFoundException();
    
    const userGames = await this.prisma.$queryRaw`
      SELECT
      g.points_user1, g.points_user2, g.user1_id, g.user2_id,
      u1.username AS user1_username, u2.username AS user2_username
      FROM "Game" g
      INNER JOIN "User" u1 ON g.user1_id = u1.id
      INNER JOIN "User" u2 ON g.user2_id = u2.id
      WHERE g.user1_id = ${id} OR g.user2_id = ${id}
      ORDER BY g."createdAt" DESC
      LIMIT 10;
    `;
    return userGames;
  }

  async addUserBlocked(userId: number, targetId: number){
    const user = await this.findUserById(userId)
    const target = await this.findUserById(targetId)
    if (!user || !target)
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

  async checkFriendships(requester_id: number, adressee_id: number) {
    const friendship = await this.findFriendShipByIds(adressee_id, requester_id);
    const friendship2 = await this.findFriendShipByIds(requester_id, adressee_id);
    if(friendship)
      return (friendship.status === 'ENABLED' ? 'Alredy friends' : 'Friendship pending')
    else if(friendship2)
      return (friendship2.status === 'ENABLED' ? 'Alredy friends' : 'Friendship pending')
    return null;
  }

  async addUserFriends(requester_id: number, adressee_id: number){
    const requester = await this.findUserById(requester_id)
    const adressee = await this.findUserById(adressee_id)
    if(!requester || !adressee)
      throw new NotFoundException('User not found');
    
    const checkFriends = await this.checkFriendships(requester_id, adressee_id);
    if(checkFriends !== null)
      throw new ForbiddenException(checkFriends)

    if(requester_id === adressee_id)
      throw new ForbiddenException('Requester and adressee has same id')
    
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

  async getUserFriendships(user_id: number) {
    const friendships = await this.prisma.userFriendship.findMany({
      where: {
        OR: [
          {requester_id: user_id},
          {adressee_id: user_id}
        ]
      }
    })
    if(!friendships)
      throw new NotFoundException('No friendships found for user')
    return friendships
  }

  async findAchievementByName(name: string){
    const achievement = await  this.prisma.achievement.findUnique({
      where: {
        name: name
      }
    })
    return achievement;
  }

  async assingAchievementToUser(id: number, achievementName: string){
    const user = await this.findUserById(id)
    const achievement = await  this.findAchievementByName(achievementName)
    if(!user)
      throw new NotFoundException('User not found')
    else if(!achievement)
      throw new NotFoundException('Achievement not found')
    
    try {
      await this.prisma.user.update({
        where: {id: id},
        data: {
          achievements: {
            connect: [{id: achievement.id}]
          }
        }
      })
      await this.prisma.achievement.update({
        where: {id: achievement.id},
        data: {
          users: {
            connect: [{id: id}]
          }
        }
      })
    } catch (error) {
      throw new ForbiddenException('Could not add achievement')
    }
  }

  async updateProfilePhoto(userId: number, url: string) {
    this.prisma.user.update({
      where: {
        id: userId
      }, data: {
        avatarURL: url
      }
    })
  }
}
