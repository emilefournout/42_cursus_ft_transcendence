import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class AddChatMemberDto {
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
