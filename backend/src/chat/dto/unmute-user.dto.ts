import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsNotEmpty, IsNumber} from 'class-validator';
import {IsValidUserId} from 'src/user/validators/user-valid-id.decorator';

export class UnmuteUserDto {
  @IsNumber()
  @IsValidUserId()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
