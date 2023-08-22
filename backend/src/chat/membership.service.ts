import * as argon2 from 'argon2';
import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { ChatRoleDto } from './dto/update-chat-member.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MembershipService {
  
  constructor(private prisma: PrismaService,
    private chatService: ChatService,
    private userService: UserService){}

  async findChatMemberByIds(chatId: number, userId: number) {
    const chatMember = await this.prisma.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId: chatId,
          userId: userId
        }
      }
    });
    return chatMember;
  }
  
  async findChatMemberByChatId(chatId: any) {
    const chatMembers = await this.prisma.chatMember.findMany({
      where: {
        chatId: chatId
      }
    });
    return chatMembers;
  }

  
  async createChatMember(chatId: number, createChatMemberDto: CreateChatMemberDto) {
    const chat = await this.chatService.findChatById(chatId)
    const user = await this.userService.findUserById(createChatMemberDto.id)
    if(!chat || !user)
      throw new NotFoundException(`${'Chat' ? !chat : 'User'} not found`);
    await this.checkAccess(chat, createChatMemberDto);
    try {
      await this.prisma.chatMember.create({
        data: {
          userId: createChatMemberDto.id,
          chatId: chatId
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
      {
        if (error.code === 'P2002') {
          throw new ForbiddenException('There is a unique constraint violation, this user id cannot be assigned again to this chat');
        }
      }
      throw new ForbiddenException('Could not save chat member');
    }
  }

  private async checkAccess(chat, createChatMemberDto: CreateChatMemberDto) {
    if (chat.visibility === 'PRIVATE')
      throw new ForbiddenException('Chat is private');
    else if (chat.visibility === 'PROTECTED') {
      try {
        if (!createChatMemberDto.password || !await argon2.verify(chat.password, createChatMemberDto.password))
          throw new UnauthorizedException('Incorrect password');
      } catch (error) {
        throw new UnauthorizedException('Incorrect password');
      }
    }
  }

  async deleteChatMember(chatId: number, userId: number) {
    const chatMember = await this.findChatMemberByIds(chatId, userId);
    let newOwner;
    if(!chatMember)
      throw new NotFoundException('Chat member not found');
    if(chatMember.owner === true) {
      newOwner = await this.findNewOwner(userId);
    }
    try {
      await this.prisma.chatMember.delete({
        where: {
          chatId_userId: {
            chatId: chatId,
            userId: userId
          }
        }
      });
    } catch(error) {
      throw new ForbiddenException('Could not delete chat member')
    }
    if(chatMember.owner === true && !newOwner) {
      try {
        this.chatService.deleteChat(chatId);
      } catch(error) {
        throw new ForbiddenException('Could not delete chat');
      }
    }
    else if(chatMember.owner === true)
      await this.updateChatMember(newOwner.userId, chatId, {owner: true, administrator: true});
  }

  private async findNewOwner(userId: number) {
    return await this.prisma.chatMember.findFirst({
      where: {
        userId: {
          not: userId
        },
      },
      orderBy: [
        {
          administrator: 'desc'
        },
        {
          createdAt: 'asc'
        }
      ]
      }
    );
  }

  async updateChatMember(userId: number, chatId: number, newData: ChatRoleDto) {
    const user = await this.findChatMemberByIds(chatId, userId);
    if(!user)
      throw new NotFoundException('Chat member not found')
    if(newData.owner === true) {
      newData.administrator = true;
      const owner = await this.prisma.chatMember.findFirst({
        where: {
          chatId: chatId,
          owner: true
        }
      })
      if(owner)
        await this.updateChatMember(owner.userId, chatId, {administrator: true, owner: false})
    }
    try {
      await this.prisma.chatMember.update({
        where: {
          chatId_userId: {
            userId: userId,
            chatId: chatId
          }
        },
        data: newData
      });
    } catch(error) {
      throw new ForbiddenException('Could not update user');
    }
  }
  
  async muteUser(chatId: number, userId: number, muteTime: number) {
      const chatMember = await this.prisma.chatMember.findFirst({
        where: {
          chatId: chatId,
          userId: userId
        }
      })
      if (!chatMember)
        throw new NotFoundException("User not found")
      if (chatMember.administrator)
        throw new BadRequestException("User not found")
      const muteDate = new Date(Date.now())
      muteDate.setTime(muteDate.getTime() + muteTime)
      await this.prisma.chatMember.update({
        data: {
          muted: true,
          mutedExpiringDate: muteDate
        },
        where: {
          chatId_userId: {
            chatId: chatId,
            userId: userId
          }
        }
      })
  }

  async unmuteUser(chatId: number, userId: number) {
    const chatMember = await this.prisma.chatMember.findFirst({
      where: {
        chatId: chatId,
        userId: userId
      }
    })
    if (!chatMember)
      throw new NotFoundException("User not found")
    await this.prisma.chatMember.update({
      data: {
        muted: false,
        mutedExpiringDate: null
      },
      where: {
        chatId_userId: {
          chatId: chatId,
          userId: userId
        }
      }
    })
  }
  
  async isUserMemberOfChat(userId: number, chatId: number) : Promise<boolean> {
    const chatMember = await this.findChatMemberByIds(userId, chatId);
    if (!chatMember) return false
    return true;
  }

  async isUserAllowedToTextOnChat(userId: number, chatId: number) : Promise<boolean> {
    const chatMember = await this.findChatMemberByIds(userId, chatId);
    if (!chatMember) return false
    if (chatMember.muted && chatMember.mutedExpiringDate > new Date(Date.now())) return false
    return true;
  }

  async isOwnerOfTheChat(userId: number, chatId: number) : Promise<boolean> {
    const chatMember = await this.findChatMemberByIds(userId, chatId);
    if (!chatMember) return false
    return chatMember.owner
  }

  async isAdministratorOfTheChat(userId: number, chatId: number) : Promise<boolean> {
    const chatMember = await this.findChatMemberByIds(userId, chatId);
    if (!chatMember) return false
    return chatMember.administrator
  }

}
