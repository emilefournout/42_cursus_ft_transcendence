import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsValidUserId } from 'src/user/validators/user-valid-id.decorator';

export class ChatMessageDto {
  @IsNumber()
  @IsDefined()
  @ApiProperty({
    type: Number,
    description: 'Chat identificator',
  })
  chatId: number;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    type: String,
    description: 'Text message',
  })
  text: string;
}
