import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChatMessageDto {
  @IsNumber()
  @IsDefined()
  @ApiProperty({
    type: Number,
    description: 'Chat identificator',
  })
  chatId: number;

  @IsNumber()
  @IsDefined()
  @ApiProperty({
    type: Number,
    description: 'User identificator',
  })
  userId: number;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({
    type: String,
    description: 'Text message',
  })
  text: string;
}
