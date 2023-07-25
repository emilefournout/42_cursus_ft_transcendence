import { ApiProperty } from "@nestjs/swagger";
import { ChatVisibility } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateChatDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  password?: String
  
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ChatVisibility)
  chatVisibility?: ChatVisibility;
}
