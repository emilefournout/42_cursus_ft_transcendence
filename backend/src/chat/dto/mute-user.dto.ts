import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, Max, Min } from 'class-validator';
import { IsValidUserId } from 'src/user/validators/user-valid-id.decorator';

export class MuteUserDto {
  @IsNumber()
  @IsValidUserId()
  @IsDefined()
  @ApiProperty({
    type: Number,
    description: 'The user id to be muted in the chat',
  })
  userId: number;

  @IsNumber()
  @IsDefined()
  @Min(900000)
  @Max(5400000)
  @ApiProperty({
    type: Number,
    description:
      'The milisencods to mute the user from 15 minutes to 90 minutes',
  })
  muteTime: number;
}
