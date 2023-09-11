import {IsDefined, IsNumber} from 'class-validator';
import {IsValidUserId} from 'src/user/validators/user-valid-id.decorator';

export class UserIdDto {
  @IsDefined()
  @IsNumber()
  @IsValidUserId()
  userId: number;
}
