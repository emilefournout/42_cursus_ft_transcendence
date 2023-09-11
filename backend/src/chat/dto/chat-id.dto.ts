import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsNumber} from 'class-validator';

export class ChatIdDto {
  @IsNumber()
  @IsDefined()
  @ApiProperty({
    type: Number,
    description: 'Chat identificator',
  })
  chatId: number;
}
