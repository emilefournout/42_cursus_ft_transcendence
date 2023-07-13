import { Controller, Get, NotFoundException, Param, Post, ParseIntPipe, Body, ForbiddenException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto, CreateMessageDto } from './dto';
import { throwError } from 'rxjs';
import { AddChatUserDto } from './dto/add-chat-user.dto';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get(':id')
    async findChat(@Param('id', ParseIntPipe) id) {
        const chat = await this.chatService.findChatById(id);
        if (!chat)
            throw new NotFoundException('Chat not found')
        return chat;
    }

    @Get(':id/messages')
    async findChatMessages(@Param('id', ParseIntPipe) id) {
        const messages = await this.chatService.findChatMessagesById(id);
        if (!messages)
            throw new NotFoundException('Chat not found')
        return messages;
    }

    @Post()
    async createChat(@Body() createChatDto: CreateChatDto) {
        try {
            await this.chatService.createChat(createChatDto.user_id, createChatDto.chatVisibility, createChatDto.password);
        } catch (error) {
            throw new ForbiddenException("Chat could not be created");
        }
    }

    @Post(':id/message')
    async createChatMessage(@Param('id', ParseIntPipe) chatId, @Body()createMessageDto: CreateMessageDto) {
        const created: boolean = await this.chatService.createChatMessages(chatId, createMessageDto.userId, createMessageDto.text);
        if (!created)
            throw new ForbiddenException('Message not created')
    }

    @Post(':id/user')
    async addChatUser(@Param('id', ParseIntPipe) chatId, @Body() addChatUserDto: AddChatUserDto) {
        await this.chatService.addChatUser(chatId, addChatUserDto.id);
    }
}
