import { CreateUserDto } from './dto/user.dto';
import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Body,
  ParseIntPipe,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id) {
    const user = this.userService.getUserInfoById(id);
    if (user === undefined) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    this.userService.createUser(createUserDto.username, createUserDto.password, createUserDto.email, createUserDto.avatar);
  }

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id) {
    throw new NotImplementedException();
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id) {
    throw new NotImplementedException();
  }
}
