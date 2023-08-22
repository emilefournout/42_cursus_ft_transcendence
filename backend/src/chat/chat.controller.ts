import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  ParseIntPipe,
  Body,
  ForbiddenException,
  Delete,
  Patch,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto, CreateChatDto, CreateMessageDto } from './dto';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';
import { DeleteChatMemberDto } from './dto/delete-chat-member.dto';
import { MembershipService } from './membership.service';
import { UpdateChatMemberDto } from './dto/update-chat-member.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { UpdateChatDto } from './dto/update-chat.dto';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { userInfo } from 'os';
import { MuteUserDto } from './dto/mute-user.dto';
import { UnmuteUserDto } from './dto/unmute-user.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private membershipService: MembershipService
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a list of chats from the user' })
  async findChats(@GetUser() user) {
    const chat = await this.chatService.findChatsInfo(user.sub);
    if (!chat) throw new NotFoundException('Chats not found');
    return chat;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id' })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get basic info about a chat',
    description: 'If the user is not in the chat, members will be empty'
  })
  async findChat(@GetUser() user, @Param('id', ParseIntPipe) id) {
    const chat = await this.chatService.findChatByIdWithUserInside(
      id,
      user.sub
    );
    if (!chat) throw new NotFoundException('Chat not found');
    return chat;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Adds a new chat room',
    description:
      'Password is optional. If chatVisibility is protected and no password is provided, a bad request error will be returned'
  })
  async createChat(@GetUser() user, @Body() createChatDto: CreateChatDto): Promise<ChatDto> {
    try {
      const newChat = await this.chatService.createChat(
        user.sub,
        createChatDto.chatVisibility,
        createChatDto.password,
        createChatDto.name
      );
      return newChat;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Chat could not be created');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Deletes a chat only if owner' })
  async deleteChat(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId
    ) {
    if (!this.membershipService.isOwnerOfTheChat(user.sub, chatId)) throw new ForbiddenException("User is not allowed to delete this chat")
    await this.chatService.deleteChat(chatId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Update chat visibility or password',
    description:
      'Password and chatVisibility are optional. If neither of them are provided, a bad request error will be returned. If chatVisibility changes to PROTECTED, a password is required. If the chat to be updated has DIRECT visibility, a forbidden error will be returned'
  })
  async updateChat(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() updateChatDto: UpdateChatDto
  ) {
    if (!this.membershipService.isOwnerOfTheChat(user.sub, chatId)) throw new ForbiddenException("User is not update information from this chat")
    await this.chatService.updateChat(chatId, updateChatDto);
  }

  @Get(':id/users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Gets chat member',
  })
  async getChatMember(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
  ) {
    if (!this.membershipService.isUserMemberOfChat(user.sub, chatId)) throw new ForbiddenException("User is not part of this chat")
    return await this.membershipService.findChatMemberByChatId(chatId);
  }

  @Post(':id/user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Adds a new chat member',
    description: 'Password is optional'
  })
  async createChatMember(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() createChatMemberDto: CreateChatMemberDto
  ) {
    if (!this.membershipService.isAdministratorOfTheChat(user.sub, chatId)) throw new ForbiddenException("User is not an administrator of this chat")
    await this.membershipService.createChatMember(chatId, createChatMemberDto);
  }

  @Delete(':id/user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Removes a chat member',
    description: 'Password is optional'
  })
  async deleteChatMember(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() deleteChatMemberDto: DeleteChatMemberDto
  ) {
    if (!this.membershipService.isAdministratorOfTheChat(user.sub, chatId)) throw new ForbiddenException("User is not an administrator of this chat")
    await this.membershipService.deleteChatMember(
      chatId,
      deleteChatMemberDto.id
    );
  }

  @Patch(':id/user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Updates chat member privileges',
    description:
      'In role, owner and administrator are optional, but at least one must be provided'
  })
  async updateChatMember(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() updateChatMember: UpdateChatMemberDto
  ) {
    if (!this.membershipService.isOwnerOfTheChat(user.sub, chatId)) throw new ForbiddenException("User is not update information from this chat")
    await this.membershipService.updateChatMember(
      updateChatMember.userId,
      chatId,
      updateChatMember.role
    );
  }

  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  async findChatMessages(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId
  ) {
    if (!await this.membershipService.isUserMemberOfChat(user.sub, chatId)) throw new UnauthorizedException("User is not part of this chat")
    const messages = await this.chatService.findChatMessagesById(chatId);
    if (!messages) throw new NotFoundException('Chat not found');
    return messages;
  }

  @Post(':id/message')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  async createChatMessage(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() createMessageDto: CreateMessageDto
  ) {
    if (!await this.membershipService.isUserAllowedToTextOnChat(user.sub, chatId)) throw new UnauthorizedException("User cannot text in this chat")
    const created = await this.chatService.createChatMessages(
      chatId,
      createMessageDto.userId,
      createMessageDto.text
    );
    if (!created) throw new ForbiddenException('Message not created');
    const messages = await this.chatService.findChatMessagesById(chatId);
    return messages;
  }

  @Post(':id/mute')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Mutes a chat member for a limited time' })
  async muteChatMember(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() muteUserDto: MuteUserDto
  ) {
    if (!this.membershipService.isAdministratorOfTheChat(user.sub, chatId)) throw new ForbiddenException("User is not an administrator of this chat")
    await this.membershipService.muteUser(
      chatId,
      muteUserDto.userId,
      muteUserDto.muteTime
    );
  }

  @Delete(':id/mute')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Removes the mutes a chat member for a limited time'
  })
  async unmuteChatMember(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() muteUserDto: UnmuteUserDto
  ) {
    if (!this.membershipService.isAdministratorOfTheChat(user.sub, chatId)) throw new ForbiddenException("User is not an administrator of this chat")
    await this.membershipService.unmuteUser(chatId, muteUserDto.userId);
  }
}
