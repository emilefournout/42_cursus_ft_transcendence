export class UserNotFoundException extends Error {
  constructor() {
    super('User not found');
  }
}

export class UserNotCreatedException extends Error {
  constructor() {
    super('User not created');
  }
}

export class UsernameExistsException extends Error {
  constructor() {
    super('Username already exists');
  }
}
