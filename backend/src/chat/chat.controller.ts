import { Controller, Get, NotFoundException, Param, Post, ParseIntPipe, Body, ForbiddenException, Delete, Patch } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto, CreateMessageDto } from './dto';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';
import { DeleteChatMemberDto } from './dto/delete-chat-member.dto';
import { MembershipService } from './membership.service';
import { UpdateChatMemberDto } from './dto/update-chat-member.dto';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService, private memberShipService: MembershipService) {}

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
            console.log(error)
            throw new ForbiddenException("Chat could not be created");
        }
    }

    @Delete(':id')
    async deleteChat(@Param('id', ParseIntPipe) id) {
        await this.chatService.deleteChat(id)
    }

    @Post(':id/message')
    async createChatMessage(@Param('id', ParseIntPipe) chatId, @Body()createMessageDto: CreateMessageDto) {
        const created: boolean = await this.chatService.createChatMessages(chatId, createMessageDto.userId, createMessageDto.text);
        if (!created)
            throw new ForbiddenException('Message not created')
    }

    @Post(':id/user')
    async createChatMember(@Param('id', ParseIntPipe) chatId, @Body() createChatMemberDto: CreateChatMemberDto) {
        await this.memberShipService.createChatMember(chatId, createChatMemberDto);
    }
    @Delete(':id/user')
    async deleteChatMember(@Param('id', ParseIntPipe) chatId, @Body() deleteChatMemberDto: DeleteChatMemberDto) {
        await this.memberShipService.deleteChatMember(chatId, deleteChatMemberDto.id);
    }
    @Patch(':id/user')
    async updateChatMember(@Param('id', ParseIntPipe) chatId, @Body() updateChatMember: UpdateChatMemberDto) {
        await this.memberShipService.updateChatMember(updateChatMember.userId, chatId, updateChatMember.role)
    }
}
