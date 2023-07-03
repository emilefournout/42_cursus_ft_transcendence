import { User } from '../user/user.entity';

export class Game {
  uuid: string;
  user1_id: User;
  user2_id: User;
  points_user1: number;
  points_user2: number;
  timestamp: Date;
}
