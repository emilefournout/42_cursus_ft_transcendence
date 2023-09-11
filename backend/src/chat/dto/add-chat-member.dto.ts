import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsNotEmpty, IsNumber} from 'class-validator';
import {IsValidUserId} from 'src/user/validators/user-valid-id.decorator';

export class AddChatMemberDto {
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @IsValidUserId()
  id: number;
}
