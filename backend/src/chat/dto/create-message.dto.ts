import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsInt, IsString} from 'class-validator';
import {IsValidUserId} from 'src/user/validators/user-valid-id.decorator';

export class CreateMessageDto {
  @ApiProperty()
  @IsDefined()
  @IsInt()
  @IsValidUserId()
  userId: number;

  @ApiProperty()
  @IsDefined()
  @IsString()
  text: string;
}
