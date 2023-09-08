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
  UnauthorizedException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  CreateChatDto,
  CreateMessageDto,
  UpdateChatMemberDto,
  DeleteChatMemberDto,
  AddChatMemberDto,
} from './dto';
import { MembershipService } from './membership.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateChatDto } from './dto/update-chat.dto';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { MuteUserDto } from './dto/mute-user.dto';
import { UnmuteUserDto } from './dto/unmute-user.dto';
import { ChatMemberBasicInfoDto } from './dto/info-chat-member.dto';
import { ChatBasicInfoDto } from './dto/info-chat.dto';
import { ChatShortInfoDto } from './dto/short-info-chat.dto';
import { JoinChatDto } from './dto/join-chat.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { UnbanUserDto } from './dto/unban-user.dto';
import { UserBasicInfoDto } from 'src/user/dto/info-user.dto';
import { UserService } from 'src/user/user.service';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private membershipService: MembershipService,
    private userService: UserService
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a list of chats from the user' })
  @ApiResponse({ type: [ChatShortInfoDto] })
  async findChats(@GetUser() user): Promise<ChatShortInfoDto[]> {
    const chat = await this.chatService.findChatsInfoById(user.sub);
    if (!chat) throw new NotFoundException('Chats not found');
    return chat;
  }

  @Get('search/:chatName')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find a list of chats which contains the given name',
  })
  @ApiResponse({ type: [ChatShortInfoDto] })
  async findChatsByName(
    @Param('chatName') chatName: string
  ): Promise<ChatShortInfoDto[]> {
    console.log(chatName);
    const chat = await this.chatService.findChatsInfoContainingName(chatName);
    if (!chat) throw new NotFoundException('Chats not found');
    return chat;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id' })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get basic info about a chat',
    description:
      'If the user is not in the chat, response will throw an exception',
  })
  @ApiResponse({ type: ChatBasicInfoDto })
  async findChat(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId
  ): Promise<ChatBasicInfoDto> {
    if (!(await this.membershipService.isUserMemberOfChat(user.sub, chatId)))
      throw new ForbiddenException('User is not part of this chat');
    const chat = await this.chatService.findChatByIdWithUserInside(chatId);
    if (!chat) throw new NotFoundException('Chat not found');
    return chat;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Adds a new chat room',
    description:
      'Password is optional. If chatVisibility is protected and no password is provided, a bad request error will be returned',
  })
  @ApiResponse({ type: ChatBasicInfoDto })
  async createChat(
    @GetUser() user,
    @Body() createChatDto: CreateChatDto
  ): Promise<ChatBasicInfoDto> {
    try {
      const newChat = await this.chatService.createChat(
        user.sub,
        createChatDto.chatVisibility,
        createChatDto.name,
        createChatDto.password,
        createChatDto.invitedId
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
  async deleteChat(@GetUser() user, @Param('id', ParseIntPipe) chatId) {
    if (!(await this.membershipService.isOwnerOfTheChat(user.sub, chatId)))
      throw new ForbiddenException('User is not allowed to delete this chat');
    await this.chatService.deleteChat(chatId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Update chat visibility or password',
    description:
      'Password and chatVisibility are optional. If neither of them are provided, a bad request error will be returned. If chatVisibility changes to PROTECTED, a password is required. If the chat to be updated has DIRECT visibility, a forbidden error will be returned',
  })
  async updateChat(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() updateChatDto: UpdateChatDto
  ) {
    if (!(await this.membershipService.isOwnerOfTheChat(user.sub, chatId)))
      throw new ForbiddenException(
        'User is not update information from this chat'
      );
    await this.chatService.updateChat(chatId, updateChatDto);
  }

  @Get(':id/users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Gets chat members from a given chat',
  })
  @ApiResponse({ type: [ChatMemberBasicInfoDto] })
  async getChatMember(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId
  ): Promise<ChatMemberBasicInfoDto[]> {
    if (!(await this.membershipService.isUserMemberOfChat(user.sub, chatId)))
      throw new ForbiddenException('User is not part of this chat');
    const members = await this.membershipService.findChatMemberByChatId(chatId);
    return members.map((chatMember) =>
      ChatMemberBasicInfoDto.fromChatMember(chatMember)
    );
  }

  @Post(':id/user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiBody({ type: AddChatMemberDto })
  @ApiOperation({
    summary: 'Adds a new chat member to the room',
    description: 'An administrator of the chat adds a new user to the chat',
  })
  async addChatMember(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId: number,
    @Body() addChatMemberDto: AddChatMemberDto
  ) {
    if (
      !(await this.membershipService.isAdministratorOfTheChat(user.sub, chatId))
    )
      throw new ForbiddenException('User is not an administrator of this chat');
    else if (!(await this.userService.getUserInfoById(addChatMemberDto.id)))
      throw new NotFoundException('User not found');
    else if (
      await this.membershipService.isUserBannedFrom(chatId, addChatMemberDto.id)
    )
      throw new ForbiddenException('User is banned from chat');
    await this.membershipService.addChatMember(chatId, addChatMemberDto.id);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Joins the user to the given chat',
    description: 'Password is optional',
  })
  @ApiBody({ type: JoinChatDto })
  async joinChat(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() joinChatDto: JoinChatDto
  ) {
    if (await this.membershipService.isUserMemberOfChat(user.sub, chatId))
      throw new ForbiddenException('User is already a member of the chat');
    else if (!(await this.membershipService.isOpenToUsers(chatId)))
      throw new ForbiddenException('Chat is not open to join this user');
    else if(await this.membershipService.isUserBannedFrom(chatId, user.sub))
      throw new ForbiddenException('User is banned from this chat');
    await this.membershipService.createChatMember(
      chatId,
      user.sub,
      joinChatDto.password
    );
  }

  @Delete(':id/user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Removes a chat member',
    description: 'Password is optional',
  })
  async deleteChatMember(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() deleteChatMemberDto: DeleteChatMemberDto
  ) {
    if (
      !(await this.membershipService.isAdministratorOfTheChat(user.sub, chatId))
    )
      throw new ForbiddenException('User is not an administrator of this chat');
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
      'In role, owner and administrator are optional, but at least one must be provided',
  })
  async updateChatMember(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() updateChatMember: UpdateChatMemberDto
  ) {
    if (!(await this.membershipService.isAdministratorOfTheChat(user.sub, chatId))
      || (await this.membershipService.isOwnerOfTheChat(updateChatMember.userId, chatId)))
      throw new ForbiddenException(
        'User cannot update information from this chat'
      );
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
  async findChatMessages(@GetUser() user, @Param('id', ParseIntPipe) chatId) {
    if (!(await this.membershipService.isUserMemberOfChat(user.sub, chatId)))
      throw new UnauthorizedException('User is not part of this chat');
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
    if (
      !(await this.membershipService.isUserAllowedToTextOnChat(
        user.sub,
        chatId
      ))
    )
      throw new UnauthorizedException('User cannot text in this chat');
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
    if (!(await this.membershipService.isAdministratorOfTheChat(user.sub, chatId))
      || (await this.membershipService.isOwnerOfTheChat(muteUserDto.userId, chatId)))
      throw new ForbiddenException('User is not an administrator of this chat');
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
    summary: 'Removes the mutes a chat member for a limited time',
  })
  async unmuteChatMember(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() muteUserDto: UnmuteUserDto
  ) {
    if (!(await this.membershipService.isAdministratorOfTheChat(user.sub, chatId))
      || (await this.membershipService.isOwnerOfTheChat(muteUserDto.userId, chatId)))
      throw new ForbiddenException('User is not an administrator of this chat');
    await this.membershipService.unmuteUser(chatId, muteUserDto.userId);
  }

  @Get(':id/bans')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Gets banned user from a chat' })
  async getBansFromChat(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId
  ): Promise<UserBasicInfoDto[]> {
    if (
      !(await this.membershipService.isAdministratorOfTheChat(user.sub, chatId))
    )
      throw new ForbiddenException('User is not an administrator of this chat');
    return await this.membershipService.findBansByChatId(chatId);
  }

  @Post(':id/ban')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Bans a user from a chat' })
  @ApiResponse({ type: [UserBasicInfoDto] })
  async banUser(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId: number,
    @Body() banUserDto: BanUserDto
  ) {
    if (!(await this.membershipService.isAdministratorOfTheChat(user.sub, chatId))
      || (await this.membershipService.isOwnerOfTheChat(banUserDto.userId, chatId)))
      throw new ForbiddenException('User is not an administrator of this chat');
    if (
      await this.membershipService.isAdministratorOfTheChat(
        banUserDto.userId,
        chatId
      )
    )
      throw new ForbiddenException('Cannot ban an administrator of the chat');
    if (
      await this.membershipService.isUserBannedFrom(banUserDto.userId, chatId)
    )
      throw new ForbiddenException('User is already banned from this chat');
    await this.membershipService.banUser(chatId, banUserDto.userId);
  }

  @Delete(':id/ban')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({
    summary: 'Removes the ban from a user',
  })
  async unbanUser(
    @GetUser() user,
    @Param('id', ParseIntPipe) chatId,
    @Body() unbanUserDto: UnbanUserDto
  ) {
    if (
      !(await this.membershipService.isAdministratorOfTheChat(user.sub, chatId))
    )
      throw new ForbiddenException('User is not an administrator of this chat');
    if (
      !(await this.membershipService.isUserBannedFrom(
        chatId,
        unbanUserDto.userId
      ))
    )
      throw new ForbiddenException('User is not banned from this chat');
    await this.membershipService.unbanUser(chatId, unbanUserDto.userId);
  }
}
