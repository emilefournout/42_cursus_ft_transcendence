import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';
import { IsValidUserId } from 'src/user/validators/user-valid-id.decorator';

export class UnbanUserDto {
  @IsNumber()
  @IsValidUserId()
  @IsDefined()
  @ApiProperty({
    type: Number,
    description: 'The user id to be muted in the chat',
  })
  userId: number;
}
