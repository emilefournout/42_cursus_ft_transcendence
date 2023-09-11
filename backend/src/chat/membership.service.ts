import * as argon2 from 'argon2';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {UserService} from 'src/user/user.service';
import {ChatService} from './chat.service';
import {ChatRoleDto} from './dto/update-chat-member.dto';
import {Prisma} from '@prisma/client';
import {UserBasicInfoDto} from 'src/user/dto/info-user.dto';

@Injectable()
export class MembershipService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService
  ) {}

  async findChatMemberByIds(chatId: number, userId: number) {
    const chatMember = await this.prisma.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId: chatId,
          userId: userId,
        },
      },
    });
    return chatMember;
  }

  async findChatMemberByChatId(chatId: any) {
    const chatMembers = await this.prisma.chatMember.findMany({
      where: {
        chatId: chatId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    return chatMembers;
  }

  async createChatMember(chatId: number, id: number, password?: string) {
    const [chat, user] = await Promise.all([
      this.chatService.findChatById(chatId),
      this.userService.findUserByFilter({ id }),
    ]);
    if (!chat || !user)
      throw new NotFoundException(`${!chat ? 'Chat' : 'User'} not found`);
    await this.checkAccess(chat, password);
    try {
      await this.prisma.chatMember.create({
        data: {
          userId: id,
          chatId: chatId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'There is a unique constraint violation, this user id cannot be assigned again to this chat'
          );
        }
      }
      throw new ForbiddenException('Could not save chat member');
    }
  }

  async addChatMember(chatId: number, id: number) {
    const chatMember = await this.prisma.chatMember.create({
      data: {
        userId: id,
        chatId: chatId,
      },
    });
    return chatMember;
  }

  private async checkAccess(chat, password?: string) {
    if (chat.visibility === 'PRIVATE')
      throw new ForbiddenException('Chat is private');
    else if (chat.visibility === 'PROTECTED') {
      try {
        if (!password || !(await argon2.verify(chat.password, password)))
          throw new UnauthorizedException('Incorrect password');
      } catch (error) {
        throw new UnauthorizedException('Incorrect password');
      }
    }
  }

  async deleteChatMember(chatId: number, userId: number) {
    const chatMember = await this.findChatMemberByIds(chatId, userId);
    let newOwner;
    if (!chatMember) throw new NotFoundException('Chat member not found');
    if (chatMember.owner === true) {
      newOwner = await this.findNewOwner(userId, chatId);
    }
    try {
      await this.prisma.chatMember.delete({
        where: {
          chatId_userId: {
            chatId: chatId,
            userId: userId,
          },
        },
      });
    } catch (error) {
      throw new ForbiddenException('Could not delete chat member');
    }
    if (chatMember.owner === true && !newOwner) {
      try {
        this.chatService.deleteChat(chatId);
      } catch (error) {
        throw new ForbiddenException('Could not delete chat');
      }
    } else if (chatMember.owner === true)
      await this.updateChatMember(newOwner.userId, chatId, {
        owner: true,
        administrator: true,
      });
    await this.prisma.chatMember.update({
      where: {
        chatId_userId: {
          userId: newOwner.userId,
          chatId: chatId,
        },
      },
      data: {
        muted: false,
      },
    });
  }

  private async findNewOwner(userId: number, chatId: number) {
    return await this.prisma.chatMember.findFirst({
      where: {
        userId: {
          not: userId,
        },
        chatId: chatId,
      },
      orderBy: [
        {
          administrator: 'desc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });
  }

  async updateChatMember(userId: number, chatId: number, newData: ChatRoleDto) {
    const user = await this.findChatMemberByIds(chatId, userId);
    if (!user) throw new NotFoundException('Chat member not found');
    if (newData.owner === true) {
      newData.administrator = true;
      const owner = await this.prisma.chatMember.findFirst({
        where: {
          chatId: chatId,
          owner: true,
        },
      });
      if (owner)
        await this.updateChatMember(owner.userId, chatId, {
          administrator: true,
          owner: false,
        });
    }
    try {
      await this.prisma.chatMember.update({
        where: {
          chatId_userId: {
            userId: userId,
            chatId: chatId,
          },
        },
        data: newData,
      });
    } catch (error) {
      throw new ForbiddenException('Could not update user');
    }
  }

  async findBansByChatId(chatId: number): Promise<UserBasicInfoDto[]> {
    const chatWithBannedUSers = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
      },
      include: {
        bannedUsers: true,
      },
    });
    return chatWithBannedUSers.bannedUsers.map((user) =>
      UserBasicInfoDto.fromUser(user)
    );
  }

  async banUser(chatId: number, userId: number) {
    await Promise.all([
      this.deleteChatMember(chatId, userId),
      this.prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          bannedUsers: {
            connect: {
              id: userId,
            },
          },
        },
      }),
    ]);
  }

  async unbanUser(chatId: number, userId: number) {
    await this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        bannedUsers: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  async muteUser(chatId: number, userId: number, muteTime: number) {
    const chatMember = await this.prisma.chatMember.findFirst({
      where: {
        chatId: chatId,
        userId: userId,
      },
    });
    if (!chatMember) throw new NotFoundException('User not found');
    const muteDate = new Date(Date.now());
    muteDate.setTime(muteDate.getTime() + muteTime);
    await this.prisma.chatMember.update({
      data: {
        muted: true,
        mutedExpiringDate: muteDate,
      },
      where: {
        chatId_userId: {
          chatId: chatId,
          userId: userId,
        },
      },
    });
  }

  async unmuteUser(chatId: number, userId: number) {
    const chatMember = await this.prisma.chatMember.findFirst({
      where: {
        chatId: chatId,
        userId: userId,
      },
    });
    if (!chatMember) throw new NotFoundException('User not found');
    await this.prisma.chatMember.update({
      data: {
        muted: false,
        mutedExpiringDate: null,
      },
      where: {
        chatId_userId: {
          chatId: chatId,
          userId: userId,
        },
      },
    });
  }

  async isUserMemberOfChat(userId: number, chatId: number): Promise<boolean> {
    const chatMember = await this.findChatMemberByIds(chatId, userId);
    if (!chatMember) return false;
    return true;
  }

  async isUserAllowedToTextOnChat(
    userId: number,
    chatId: number
  ): Promise<boolean> {
    const chatMember = await this.findChatMemberByIds(chatId, userId);
    if (!chatMember) return false;
    if (chatMember.muted && chatMember.mutedExpiringDate > new Date(Date.now()))
      return false;
    if (chatMember.muted) {
      await this.prisma.chatMember.update({
        where: {
          chatId_userId: {
            chatId: chatId,
            userId: userId,
          },
        },
        data: {
          muted: false,
        },
      });
    }
    return true;
  }

  async isOwnerOfTheChat(userId: number, chatId: number): Promise<boolean> {
    const chatMember = await this.findChatMemberByIds(chatId, userId);
    if (!chatMember) return false;
    return chatMember.owner;
  }

  async isAdministratorOfTheChat(
    userId: number,
    chatId: number
  ): Promise<boolean> {
    const chatMember = await this.findChatMemberByIds(chatId, userId);
    if (!chatMember) return false;
    return chatMember.administrator;
  }

  async isUserBannedFrom(chatId: number, userId: number): Promise<boolean> {
    try {
      const chat = await this.prisma.user.findFirst({
        where: {
          id: userId,
          chatBan: {
            some: {
              id: chatId,
            },
          },
        },
      });
      return chat !== null;
    } catch (error) {
      return false;
    }
  }

  async isOpenToUsers(chatId: number): Promise<boolean> {
    const chatMember = await this.chatService.findChatById(chatId);
    if (!chatMember) return false;
    return (
      chatMember.visibility === 'PUBLIC' ||
      chatMember.visibility === 'PROTECTED'
    );
  }

  async isUserAllowedToJoin(chatId: number, userId: number) {
    const chat = await this.chatService.findChatById(chatId);
    const user = await this.userService.getUserInfoById(userId);
    if (!chat || !user || (await this.isUserBannedFrom(chatId, userId)))
      return false;
    return true;
  }
}
