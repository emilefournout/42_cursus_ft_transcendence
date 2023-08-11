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
  UseGuards
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto, CreateMessageDto } from './dto';
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
    private memberShipService: MembershipService
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
  @ApiOperation({ summary: 'Get basic info about a chat' })
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
  async createChat(@GetUser() user, @Body() createChatDto: CreateChatDto) {
    try {
      await this.chatService.createChat(
        user.sub,
        createChatDto.chatVisibility,
        createChatDto.password,
        createChatDto.name
      );
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Chat could not be created');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // TODO - Check
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Deletes a chat only if owner' })
  async deleteChat(@Param('id', ParseIntPipe) id) {
    await this.chatService.deleteChat(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // TODO - Check
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Update chat visibility or password',
    description:
      'Password and chatVisibility are optional. If neither of them are provided, a bad request error will be returned. If chatVisibility changes to PROTECTED, a password is required. If the chat to be updated has DIRECT visibility, a forbidden error will be returned'
  })
  async updateChat(
    @Param('id', ParseIntPipe) id,
    @Body() updateChatDto: UpdateChatDto
  ) {
    await this.chatService.updateChat(id, updateChatDto);
  }

  @Post(':id/user')
  @UseGuards(JwtAuthGuard) // TODO - Check
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Adds a new chat member',
    description: 'Password is optional'
  })
  async createChatMember(
    @Param('id', ParseIntPipe) chatId,
    @Body() createChatMemberDto: CreateChatMemberDto
  ) {
    await this.memberShipService.createChatMember(chatId, createChatMemberDto);
  }

  @Delete(':id/user')
  @UseGuards(JwtAuthGuard) // TODO - Check
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Removes a chat member',
    description: 'Password is optional'
  })
  async deleteChatMember(
    @Param('id', ParseIntPipe) chatId,
    @Body() deleteChatMemberDto: DeleteChatMemberDto
  ) {
    await this.memberShipService.deleteChatMember(
      chatId,
      deleteChatMemberDto.id
    );
  }

  @Patch(':id/user')
  @UseGuards(JwtAuthGuard) // TODO - Check
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Updates chat member privileges',
    description:
      'In role, owner and administrator are optional, but at least one must be provided'
  })
  async updateChatMember(
    @Param('id', ParseIntPipe) chatId,
    @Body() updateChatMember: UpdateChatMemberDto
  ) {
    await this.memberShipService.updateChatMember(
      updateChatMember.userId,
      chatId,
      updateChatMember.role
    );
  }

  @Get(':id/messages')
  @ApiParam({ name: 'id' })
  async findChatMessages(@Param('id', ParseIntPipe) id) {
    const messages = await this.chatService.findChatMessagesById(id);
    if (!messages) throw new NotFoundException('Chat not found');
    return messages;
  }

  @Post(':id/message')
  @ApiParam({ name: 'id' })
  async createChatMessage(
    @Param('id', ParseIntPipe) chatId,
    @Body() createMessageDto: CreateMessageDto
  ) {
    const created: boolean = await this.chatService.createChatMessages(
      chatId,
      createMessageDto.userId,
      createMessageDto.text
    );
    if (!created) throw new ForbiddenException('Message not created');
  }

  @Post(':id/mute')
  @UseGuards(JwtAuthGuard) // TODO - Check
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Mutes a chat member for a limited time' })
  async muteChatMember(
    @Param('id', ParseIntPipe) chatId,
    @Body() muteUserDto: MuteUserDto
  ) {
    await this.memberShipService.muteUser(
      chatId,
      muteUserDto.userId,
      muteUserDto.muteTime
    );
  }

  @Delete(':id/mute')
  @UseGuards(JwtAuthGuard) // TODO - Check
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Removes the mutes a chat member for a limited time'
  })
  async unmuteChatMember(
    @Param('id', ParseIntPipe) chatId,
    @Body() muteUserDto: UnmuteUserDto
  ) {
    await this.memberShipService.unmuteUser(chatId, muteUserDto.userId);
  }
}
