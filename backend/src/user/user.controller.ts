import {
  Controller,
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

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id) {
    const user = await this.userService.findUserById(id);
    if (user === null || user === undefined)
      throw new NotFoundException('User not found')
    return user;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findUserMe(@GetUser() user) {
    const userInfo = await this.userService.getUserInfoById(user.id);
    if (userInfo === null || userInfo === undefined) {
      throw new NotFoundException('User not found');
    }
    return userInfo;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const created:boolean = await this.userService.createUser(createUserDto.username, createUserDto.avatar);
    if (!created)
      throw new ForbiddenException('User could not be created')
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }


  @Patch(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.updateUser(id, updateUserDto);
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
