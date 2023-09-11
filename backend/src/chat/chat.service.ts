import * as argon2 from 'argon2';
import {
    BadRequestException,
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {Chat, ChatVisibility} from '@prisma/client';
import {UpdateChatDto} from './dto/update-chat.dto';
import {ChatBasicInfoDto} from './dto/info-chat.dto';
import {ChatShortInfoDto} from './dto/short-info-chat.dto';
import {MembershipService} from './membership.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => MembershipService))
    private membershipService: MembershipService
  ) {}

  async findChatsInfoById(id: number): Promise<ChatShortInfoDto[]> {
    const chats: Chat[] = await this.prisma.$queryRaw`
    SELECT
    *
    FROM "Chat" chat
    INNER JOIN "ChatMember" chatMem ON chat.id = chatMem."chatId"
    WHERE chatMem."userId" = ${id}
  `;
    return chats.map((chat) => ChatShortInfoDto.fromChat(chat));
  }

  async findChatsInfoContainingName(
    chatName: string
  ): Promise<ChatShortInfoDto[]> {
    const chats: Chat[] = await this.prisma.chat.findMany({
      where: {
        name: {
          contains: chatName,
        },
        OR: [
          {
            visibility: 'PROTECTED',
          },
          {
            visibility: 'PUBLIC',
          },
        ],
      },
    });
    return chats.map((chat) => ChatShortInfoDto.fromChat(chat));
  }

  async createChat(
    user_id: number,
    chatVisibility: ChatVisibility,
    name: string,
    password?: string,
    invitedId?: number
  ): Promise<ChatBasicInfoDto> {
    if (chatVisibility === 'PROTECTED' && !password) {
      throw new BadRequestException('No password provided for protected chat');
    }

    let hashedPassword: string | null = null;
    if (chatVisibility === 'PROTECTED' && password) {
      hashedPassword = await argon2.hash(password);
    }

    const chatData = {
      visibility: chatVisibility,
      name: name,
      password: hashedPassword,
      members: {
        create: [{ userId: user_id, administrator: true, owner: true }],
      },
    };

    if (invitedId) {
      chatData.members.create.push({
        userId: invitedId,
        administrator: false,
        owner: false,
      });
    }

    const chat = await this.prisma.chat.create({
      data: chatData,
    });
    if (chat) return ChatBasicInfoDto.fromChat(chat, []);
    return null;
  }

  async deleteChat(chatId: number) {
    const chat = await this.findChatById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');
    try {
      await this.prisma.chat.delete({
        where: {
          id: chatId,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Could not delete chat');
    }
  }

  async updateChat(id: number, updateChatDto: UpdateChatDto) {
    if (
      updateChatDto.password === undefined &&
      updateChatDto.chatVisibility === undefined
    )
      throw new BadRequestException('Empty request');
    else if (
      updateChatDto.chatVisibility === 'PROTECTED' &&
      !updateChatDto.password
    )
      throw new BadRequestException('Protected chat requires a password');
    const chat = await this.findChatById(id);
    if (!chat) throw new NotFoundException('Chat not found');
    if (updateChatDto.chatVisibility !== 'PROTECTED')
      updateChatDto.password = null;
    if(updateChatDto.password)
      chat.password = await argon2.hash(updateChatDto.password);
    chat.visibility = updateChatDto.chatVisibility;
    try {
      await this.prisma.chat.update({
        where: {
          id: id,
        },
        data: chat,
      });
    } catch (error) {
      throw new ForbiddenException('Could not update user');
    }
  }

  async createChatMessages(chat_id: number, user_id: number, text: string) {
    try {
      return await this.prisma.message.create({
        data: {
          chatId: chat_id,
          userId: user_id,
          text: text,
        },
      });
    } catch (error) {
      return false;
    }
  }

  async findChatById(id: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: id,
      },
    });
    return chat;
  }

  async findChatByIdWithUserInside(id: number): Promise<ChatBasicInfoDto> {
    const chat = await this.prisma.chat.findUnique({
      include: {
        members: {
          select: {
            userId: true,
            user: {
              select: {
                username: true,
              },
            },
            createdAt: true,
            administrator: true,
            owner: true,
            muted: true,
            mutedExpiringDate: true,
          },
        },
      },
      where: {
        id: id,
      },
    });
    if (!chat) return null;
    const banned = await this.membershipService.findBansByChatId(id);
    return ChatBasicInfoDto.fromChat(chat, banned);
  }

  async findChatMessagesById(id: number) {
    const messages = await this.prisma.message.findMany({
      where: {
        chatId: id,
      },
    });
    return messages;
  }

  async findChatMessagesByIdSortedByDate(id: number) {
    const messages = await this.prisma.message.findMany({
      where: {
        chatId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return messages;
  }
}
