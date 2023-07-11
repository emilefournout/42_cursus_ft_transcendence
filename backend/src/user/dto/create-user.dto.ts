import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  username: string;

  // @IsOptional()
  avatar?: File;
}
