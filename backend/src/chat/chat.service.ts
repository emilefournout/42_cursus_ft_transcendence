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
}
