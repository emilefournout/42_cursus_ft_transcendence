import {
  Controller,
  HttpException,
  ForbiddenException,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Body,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRelationDto } from './dto/update-user.dto';
import { UserNotCreatedException, UserNotUpdatedException, UserNotDeletedException, UserNotFoundException } from './exceptions/user-service.exception';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserBasicInfoDto } from './dto/info-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  
  constructor(private userService: UserService) {}

  @Get('info/:id')
  @ApiParam({name: 'id'})
  @ApiOperation({ summary: 'Returns a basic info about a user.' })
  @ApiResponse({ type: UserBasicInfoDto })
  async findUser(@Param('id', ParseIntPipe) id) {
    const userInfo = await this.userService.getUserInfoById(id);
    if (!userInfo)
      throw new UserNotFoundException();
    return userInfo;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns a basic info about the user who requested.' })
  @ApiResponse({ type: UserBasicInfoDto })
  async findUserMe(@GetUser() user) {
    return this.findUser(user.id)
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: "Removes the user account.", description: 'Remove your account'})
  async deleteUser(@GetUser() user) {
    let userDeleted;

    try {
      userDeleted = await this.userService.deleteUser(user.id); 
    } catch (error) {
      throw new UserNotDeletedException();
    }
    if (!user)
      throw new UserNotDeletedException();
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: "Updates the user.", description: 'Update your account'})
  async updateUser(@GetUser() user, @Body() updateUserDto: UpdateUserDto) {
    let userUpdated;

    try {
      userUpdated = await this.userService.updateUser(user.id, updateUserDto);
    } catch (error) {
      throw new UserNotUpdatedException();
    }
    if (!userUpdated)
      throw new UserNotUpdatedException();
  }

  @ApiParam({name: 'id', description: 'The id of the user the sender wants to block'})
  @ApiBearerAuth()
  @ApiOperation({summary: "Blocks the user with id for the sender", description: "The user with the id will be blocked"})
  @UseGuards(JwtAuthGuard)
  @Post('/block/:id')
  async addUserBlocked(@GetUser() user, @Param('id', ParseIntPipe) id: number) {
    await this.userService.addUserBlocked(user.id, id);
  }
  @ApiParam({name: 'id', description: 'The id of the user the sender wants to remove the block'})
  @ApiBearerAuth()
  @ApiOperation({summary: "Removes the block to id for the sender", description: "The user with the id will be unblocked"})
  @UseGuards(JwtAuthGuard)
  @Delete('/block/:id')
  async deleteUserBlocked(@GetUser() user, @Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUserBlocked(user.id, id);
  }
  @ApiParam({name: 'id', description: 'The id of the user the sender wants to be friends with'})
  @ApiBearerAuth()
  @ApiOperation({summary: "Invites id to be friends", description: "The user with the id will recieve a friendship request"})
  @UseGuards(JwtAuthGuard)
  @Post('/friends/send/:id')
  async addUserFriends(@GetUser() user, @Param('id', ParseIntPipe) id: number) {
    await this.userService.addUserFriends(user.id, id);
  }
  @ApiParam({name: 'id', description: 'The id of the user that send the invitation'})
  @ApiBearerAuth()
  @ApiOperation({summary: "Accepts the invitation from id", description: "The user with the id will have its invitation accepted"})
  @UseGuards(JwtAuthGuard)
  @Patch('/friends/accept/:id')
  async acceptUserFriends(@GetUser() user, @Param('id', ParseIntPipe) id: number) {
    await this.userService.acceptUserFriends(user.id, id);;
  }
  @ApiParam({name: 'id', description: 'The id of the user that send the invitation'})
  @ApiBearerAuth()
  @ApiOperation({summary: "Declines id user invitation", description: "The user invitation to be friends from id with the will be declined"})
  @UseGuards(JwtAuthGuard)
  @Delete('/friends/decline/:id')
  async declineUserFriends(@GetUser() user, @Param('id', ParseIntPipe) id: number) {
    await this.userService.declineUserFriends(user.id, id);;
  }
}
