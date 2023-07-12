import { IsDefined, IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsDefined()
  @IsInt()
  userId: number;

  @IsDefined()
  @IsString()
  text: string
}
