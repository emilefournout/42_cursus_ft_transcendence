import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}

export class UserNotCreatedException extends HttpException {
  constructor() {
    super('Could not create the user', HttpStatus.BAD_REQUEST);
  }
}

export class UserNotUpdatedException extends HttpException {
  constructor() {
    super('Could not update the user', HttpStatus.BAD_REQUEST);
  }
}

export class UserNotDeletedException extends HttpException {
  constructor() {
    super('Could not delete the user', HttpStatus.BAD_REQUEST);
  }
}