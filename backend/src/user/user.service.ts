const bcrypt = require('bcrypt');
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}

  createUser(username: string, password: string, email: string, avatar: File) {
  }

  findUserById(id: number) {
    return null
  }

  getUserInfoById(id: number) {
    return null
  }
}
