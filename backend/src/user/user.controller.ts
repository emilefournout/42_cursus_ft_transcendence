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

  @ApiParam({name: 'id'})
  @ApiOperation({summary: "Blocks targetId user for id", description: "Payload targetId is the user that will be blocked"})
  @Post(':id/blocked')
  async addUserBlocked(@Param('id', ParseIntPipe) id: number, @Body() updateUserRelationDto: UpdateUserRelationDto) {
    await this.userService.addUserBlocked(id, updateUserRelationDto.targetId);
  }
  @ApiParam({name: 'id'})
  @ApiOperation({summary: "Removes block to targetId user for id", description: "Payload targetId is the user that will be unblocked"})
  @Delete(':id/blocked')
  async deleteUserBlocked(@Param('id', ParseIntPipe) id: number, @Body() updateUserRelationDto: UpdateUserRelationDto) {
    await this.userService.deleteUserBlocked(id, updateUserRelationDto.targetId);
  }
  @ApiParam({name: 'id'})
  @ApiOperation({summary: "Add user targetId user to id friends", description: "Payload targetId is the user that will recieve a friendship request"})
  @Post(':id/friends')
  async addUserFriends(@Param('id', ParseIntPipe) id: number, @Body() updateUserRelationDto: UpdateUserRelationDto) {
    await this.userService.addUserFriends(id, updateUserRelationDto.targetId);
  }
  @ApiParam({name: 'id'})
  @ApiOperation({summary: "Accepts user targetId user to id friends", description: "Payload targetId is the user that will be accepted"})
  @Patch(':id/friends/accept')
  async acceptUserFriends(@Param('id', ParseIntPipe) id: number, @Body() updateUserRelationDto: UpdateUserRelationDto) {
    await this.userService.acceptUserFriends(id, updateUserRelationDto.targetId);
  }
  @ApiParam({name: 'id'})
  @Delete(':id/friends/decline')
  @ApiOperation({summary: "Removes user targetId user to id friends", description: "Payload targetId is the user that will be declined"})
  async declineUserFriends(@Param('id', ParseIntPipe) id: number, @Body() updateUserRelationDto: UpdateUserRelationDto) {
    await this.userService.declineUserFriends(id, updateUserRelationDto.targetId);
  }
}
