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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { CreateUserDto } from './dto/create-user.dto';

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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findUserMe(@GetUser() user) {
    const userInfo = this.userService.getUserInfoById(user.id);
    if (userInfo === undefined) {
      throw new NotFoundException('User not found');
    }
    return userInfo;
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
