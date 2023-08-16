import { User } from '../user/user.entity';

export class Message {
  uuid: string;
  writer: ChatMember;
}

export class ChatMember {
  user: User;
  chat: Chat;
  administrator: boolean;
}

export class Chat {
  id: number;
  timestamp: Date;
  members: ChatMember[];
}
