export enum OnlineStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PLAYING = 'PLAYING',
}

export class Avatar {
  image: File;
}

export class User {
  id: number;
  username: string;
  password: string;
  salt: string;
  email: string;
  avatar: Avatar;
  status: OnlineStatus;
}
