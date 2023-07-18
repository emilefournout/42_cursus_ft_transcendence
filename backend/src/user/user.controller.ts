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

@Controller('user')
export class UserController {
  
  constructor(private userService: UserService) {}

  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id) {
    const user = await this.userService.findUserById(id);
    if (!user)
      throw new UserNotFoundException();
    return user;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findUserMe(@GetUser() user) {
    const userInfo = await this.userService.getUserInfoById(user.id);
    if (!userInfo)
      throw new UserNotFoundException();
    return userInfo;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    let user;

    try {
      user = await this.userService.createUser(createUserDto.intraname,
         createUserDto.username,
         createUserDto.avatar);
    } catch (error) {
      throw new UserNotFoundException();
    }
    if (!user)
      throw new UserNotFoundException()
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    let user;

    try {
      user = await this.userService.deleteUser(id); 
    } catch (error) {
      throw new UserNotDeletedException();
    }
    if (!user)
      throw new UserNotDeletedException();
  }

  @Patch(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    let user;

    try {
      user = await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new UserNotUpdatedException();
    }
    if (!user)
      throw new UserNotUpdatedException();
  }

  @Post(':id/blocked')
  async addUserBlocked(@Param('id', ParseIntPipe) id: number, @Body() updateUserRelationDto: UpdateUserRelationDto) {
    await this.userService.addUserBlocked(id, updateUserRelationDto.id);
  }
  @Delete(':id/blocked')
  async deleteUserBlocked(@Param('id', ParseIntPipe) id: number, @Body() updateUserRelationDto: UpdateUserRelationDto) {
    await this.userService.deleteUserBlocked(id, updateUserRelationDto.id);
  }
  @Post(':id/friends')
  async addUserFriends(@Param('id', ParseIntPipe) id: number, @Body() updateUserRelationDto: UpdateUserRelationDto) {
    await this.userService.addUserFriends(id, updateUserRelationDto.id);
  }
  @Patch(':id/friends/accept')
  async acceptUserFriends(@Param('id', ParseIntPipe) id: number, @Body() updateUserRelationDto: UpdateUserRelationDto) {
    await this.userService.acceptUserFriends(id, updateUserRelationDto.id);
  }
  @Delete(':id/friends/decline')
  async declineUserFriends(@Param('id', ParseIntPipe) id: number, @Body() updateUserRelationDto: UpdateUserRelationDto) {
    await this.userService.declineUserFriends(id, updateUserRelationDto.id);
  }
}
