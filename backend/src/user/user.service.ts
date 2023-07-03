const bcrypt = require('bcrypt');
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Avatar, OnlineStatus, User } from './user.entity';
import { CreateUserDto, UserBasicInfoDto } from './dto/user.dto';
@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: 1,
      username: 'efournou',
      password: '',
      salt: '',
      status: OnlineStatus.ONLINE,
      email: '',
      avatar: null,
    },
    {
      id: 2,
      username: 'jarredon',
      password: '',
      salt: '',
      status: OnlineStatus.OFFLINE,
      email: '',
      avatar: null,
    },
    {
      id: 3,
      username: 'apena-ba',
      password: '',
      salt: '',
      status: OnlineStatus.ONLINE,
      email: '',
      avatar: null,
    },
    {
      id: 4,
      username: 'n-tamayo',
      password: '',
      salt: '',
      status: OnlineStatus.PLAYING,
      email: '',
      avatar: null,
    },
    {
      id: 5,
      username: 'josesanc',
      password: '',
      salt: '',
      status: OnlineStatus.PLAYING,
      email: '',
      avatar: null,
    },
  ];

  createUser(username: string, password: string, email: string, avatar: Avatar) {
    if (
      this.users.find(
        (elem) =>
          elem.username == username ||
          elem.email == email,
      ) != undefined
    ) {
      throw new ForbiddenException('Repeated username or email');
    }
    const maxID = this.users.reduce((a, b) => Math.max(a, b.id), -Infinity);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    let newUser = new User();
    newUser.id = maxID + 1;
    newUser.password = hash;
    newUser.salt = salt;
    newUser.username = username
    newUser.email = email;
    newUser.status = OnlineStatus.OFFLINE;
    newUser.avatar = null;
    this.users.push(newUser);
  }

  findUserById(id: number): User {
    return this.users.find((elem) => elem.id == id);
  }

  getUserInfoById(id: number): UserBasicInfoDto {
    const user = this.findUserById(id);
    if (user === undefined) {
      return undefined;
    }
    let userInfo = new UserBasicInfoDto();
    userInfo.id = user.id;
    userInfo.username = user.username;
    userInfo.status = user.status;
    userInfo.avatar = user.avatar;
    return userInfo;
  }
}
