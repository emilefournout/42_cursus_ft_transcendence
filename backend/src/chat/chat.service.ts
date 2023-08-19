import * as argon2 from 'argon2';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatVisibility } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatBasicInfoDto } from './dto/info-chat.dto';
import { ChatDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  
  async findChatsInfo(id: any) {
    const chats = await this.prisma.chat.findMany({
      include: {
        members: {
          where: {
            userId: id
          }
        }
      }
    })
    return chats.map((chat) => ChatBasicInfoDto.fromChat(chat));
  }

  async createChat(user_id: number, chatVisibility: ChatVisibility, password?: string, name?: string): Promise<ChatDto> {
    if(chatVisibility === 'PROTECTED' && !password)
      throw  new BadRequestException('No password provided for protected chat');
    else if (chatVisibility === 'PROTECTED' && password)
      password = await argon2.hash(password);
    else
      password = null
    return await this.prisma.chat.create({
    data: {
        visibility: chatVisibility,
        password: password,
        name: name,
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

  async updateChat(id: number, updateChatDto: UpdateChatDto) {
    if(updateChatDto.password === undefined && updateChatDto.chatVisibility === undefined)
      throw new BadRequestException('Empty request');
    else if(updateChatDto.chatVisibility === 'PROTECTED' && !updateChatDto.password)
      throw new BadRequestException('Protected chat requires a password');
    const chat = await this.findChatById(id);
    if(!chat)
      throw new NotFoundException('Chat not found');
    else if(chat.visibility === 'DIRECT')
      throw new ForbiddenException('Direct chat is immutable');
    if(updateChatDto.chatVisibility !== 'PROTECTED')
      updateChatDto.password = null
    Object.assign(chat, updateChatDto)
    try {
      this.prisma.chat.update({
        where: {
          id: id
        },
        data: chat
      })
    } catch(error) {
      throw new ForbiddenException('Could not update user');
    }
  }

  async createChatMessages(chat_id: number, user_id: number, text: string) {
    try {
        return await this.prisma.message.create({
          data: {
            chatId: chat_id,
            userId: user_id,
            text: text
          }
        });
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

  async findChatByIdWithUserInside(id: number, userId: number) {
    const chat = await this.prisma.chat.findUnique({
      include: {
        members: {
          where: {
            userId: userId
          }
        }
      },
      where: {
        id: id
      }
    });
    console.log(`Members = ${chat.members}`)
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
}
