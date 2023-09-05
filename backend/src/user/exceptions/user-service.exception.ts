export class UserNotFoundException extends Error {
  constructor() {
    super('User not found');
  }
}

export class UsernameExistsException extends Error {
  constructor() {
    super('Username already exists');
  }
}
