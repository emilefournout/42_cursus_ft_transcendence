import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class UnmuteUserDto {
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
