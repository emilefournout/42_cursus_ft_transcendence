import {HttpException, HttpStatus} from '@nestjs/common';

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
  constructor(message?: string) {
    if (message) super(message, HttpStatus.BAD_REQUEST);
    else super('User could not be updated', HttpStatus.BAD_REQUEST);
  }
}

export class UserNotDeletedException extends HttpException {
  constructor() {
    super('Could not delete the user', HttpStatus.BAD_REQUEST);
  }
}
