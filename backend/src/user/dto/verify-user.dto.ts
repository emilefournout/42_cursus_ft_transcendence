import { IsDefined, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { IsValidUserId } from '../validators/user-valid-id.decorator';

export class VerifyUserDto {
  @IsDefined()
  @IsInt()
  @IsValidUserId()
  id: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  code: string;
}
