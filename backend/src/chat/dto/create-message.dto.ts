import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsDefined()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsDefined()
  @IsString()
  text: string;
}
