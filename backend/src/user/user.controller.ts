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
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRelationDto } from './dto/update-user.dto';
import { UserNotCreatedException, UserNotUpdatedException, UserNotDeletedException, UserNotFoundException } from './exceptions/user-service.exception';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserBasicInfoDto } from './dto/info-user.dto';
import { AssignAchievementDto } from './dto/assign-achievement.dto';

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
    return this.findUser(user.sub)
  }


  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @ApiParam({name: 'username'})
  @ApiBearerAuth()
  @ApiOperation({summary: 'Returns a basic info about user by its username.'})
  async getUserInfoByName(@Param('username') username: string) {
    return await this.userService.getUserInfoByName(username)
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: "Removes the user account.", description: 'Remove your account'})
  async deleteUser(@GetUser() user) {
    let userDeleted;

    try {
      userDeleted = await this.userService.deleteUser(user.sub); 
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
      userUpdated = await this.userService.updateUser(user.sub, updateUserDto);
    } catch (error) {
      throw new UserNotUpdatedException();
    }
    if (!userUpdated)
    throw new UserNotUpdatedException();
}

  @Put('/achievements')
  @ApiOperation({summary: "Adds an achievement to a user."})
  async assingAchievementToUser(@Body() assingAchievementDto: AssignAchievementDto){
    await this.userService.assingAchievementToUser(assingAchievementDto.id, assingAchievementDto.achievementName)
  }

  @Get('/friendships')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: "Gets user friendships.", description: 'If no friendships are found, 404 will be returned'})
  async getUserFriendships(@GetUser() user) {
    return await this.userService.getUserFriendships(user.sub);
  }

  @Post('/block/:id')
  @ApiParam({name: 'id', description: 'The id of the user the sender wants to block'})
  @ApiBearerAuth()
  @ApiOperation({summary: "Blocks the user with id for the sender", description: "The user with the id will be blocked"})
  @UseGuards(JwtAuthGuard)
  async addUserBlocked(@GetUser() user, @Param('id', ParseIntPipe) id: number) {
    await this.userService.addUserBlocked(user.sub, id);
  }

  @Delete('/block/:id')
  @ApiParam({name: 'id', description: 'The id of the user the sender wants to remove the block'})
  @ApiBearerAuth()
  @ApiOperation({summary: "Removes the block to id for the sender", description: "The user with the id will be unblocked"})
  @UseGuards(JwtAuthGuard)
  async deleteUserBlocked(@GetUser() user, @Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUserBlocked(user.sub, id);
  }

  @Post('/friends/send/:id')
  @ApiParam({name: 'id', description: 'The id of the user the sender wants to be friends with'})
  @ApiBearerAuth()
  @ApiOperation({summary: "Invites id to be friends", description: "The user with the id will recieve a friendship request"})
  @UseGuards(JwtAuthGuard)
  async addUserFriends(@GetUser() user, @Param('id', ParseIntPipe) id: number) {
    await this.userService.addUserFriends(user.sub, id);
  }

  @Patch('/friends/accept/:id')
  @ApiParam({name: 'id', description: 'The id of the user that send the invitation'})
  @ApiBearerAuth()
  @ApiOperation({summary: "Accepts the invitation from id", description: "The user with the id will have its invitation accepted"})
  @UseGuards(JwtAuthGuard)
  async acceptUserFriends(@GetUser() user, @Param('id', ParseIntPipe) id: number) {
    await this.userService.acceptUserFriends(user.sub, id);;
  }

  @Delete('/friends/decline/:id')
  @ApiParam({name: 'id', description: 'The id of the user that send the invitation'})
  @ApiBearerAuth()
  @ApiOperation({summary: "Declines id user invitation", description: "The user invitation to be friends from id with the will be declined"})
  @UseGuards(JwtAuthGuard)
  async declineUserFriends(@GetUser() user, @Param('id', ParseIntPipe) id: number) {
    await this.userService.declineUserFriends(user.sub, id);;
  }
}
