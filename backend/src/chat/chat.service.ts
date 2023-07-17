import * as argon2 from 'argon2';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatVisibility } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createChat(user_id: number, chatVisibility: ChatVisibility, password?: string) {
    if(chatVisibility === 'PROTECTED' && !password)
      throw  new BadRequestException('No password provided for protected chat');
    if (password)
      password = await argon2.hash(password);
    await this.prisma.chat.create({
    data: {
        visibility: chatVisibility,
        password: password,
        members: {
        create: [{ userId: user_id, administrator: true, owner: true }]
        }
    }
    });
  }

  async deleteChat(chatId: number){
    const chat = await this.findChatById(chatId);
    if(!chat)
      throw new NotFoundException('Chat not found');
    try {
      await this.prisma.chat.delete({
        where: {
          id: chatId
        }
      });
    } catch(error) {
      throw new ForbiddenException('Could not delete chat');
    }
  }

  async createChatMessages(chat_id: number, user_id: number, text: string) {
    try {
        await this.prisma.message.create({
          data: {
            chatId: chat_id,
            userId: user_id,
            text: text
          }
        });
        return true;
    } catch (error) {
        return false;
    }
  }

  async findChatById(id: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: id
      }
    });
    return chat;
  }

  async findChatMessagesById(id: number) {
    const messages = await this.prisma.message.findMany({
      where: {
        chatId: id
      }
    });
    return messages;
  }

  async findChatMessagesByIdSortedByDate(id: number) {
    const messages = await this.prisma.message.findMany({
      where: {
        chatId: id
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    return messages;
  }

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

  async createChatMember(chatId: number, addChatUserDto: AddChatUserDto) {
    const chat = await this.findChatById(chatId)
    const user = await this.userService.findUserById(addChatUserDto.id)
    if(!chat || !user)
      throw new NotFoundException(`${'Chat' ? !chat : 'User'} not found`);
    
    const chatMember = await this.findChatMemberByIds(chatId, addChatUserDto.id)
    if(chatMember)
      throw new ForbiddenException('User alredy in chat');
    
    if(chat.visibility === 'PRIVATE')
      throw new ForbiddenException('Chat is private');
    else if(chat.visibility === 'PROTECTED'){
      try {
        if(!addChatUserDto.password || ! await argon2.verify(chat.password, addChatUserDto.password))
          throw new ForbiddenException('Incorrect password')
      } catch(error) {
        throw new ForbiddenException('Incorrect password')
      }
    }
    
    try {
      this.prisma.chatMember.create({
        data: {
          userId: addChatUserDto.id,
          chatId: chatId
        }
      });
    } catch (error) {
      throw new ForbiddenException('Could not create chat member')
    }
  }

  async deleteChatMember(chatId: number, userId: number) {
    const chatMember = this.findChatMemberByIds(chatId, userId);
    if(!chatMember)
      throw new NotFoundException('Chat member not found');
    try {
      this.prisma.chatMember.delete({
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
    // TODO -> Check if user was owner and set other user as owner
  }

}
