import * as argon2 from 'argon2';
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { ChatRoleDto } from './dto/update-chat-member.dto';

@Injectable()
export class MembershipService {
  constructor(private prisma: PrismaService, private chatService: ChatService, private userService: UserService){}

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
      throw new ForbiddenException('Could not create chat member');
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
}
