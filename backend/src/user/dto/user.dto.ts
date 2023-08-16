import { Avatar, OnlineStatus } from '../user.entity';
import { IsInt, IsNumberString, IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  //@IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;
  avatar: Avatar;
}

export class UserBasicInfoDto {
  id: number;
  username: string;
  avatar: Avatar;
  status: OnlineStatus;
}
