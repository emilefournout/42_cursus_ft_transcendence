import { Type } from "class-transformer";
import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsObject, IsOptional } from "class-validator";

export class ChatRoleDto {
  @IsOptional()
  @IsBoolean()
  owner?: boolean
  
  @IsOptional()
  @IsBoolean()
  administrator?: boolean
}

export class UpdateChatMemberDto {
  @IsDefined()
  @IsNumber()
  userId: number

  @IsDefined()
  @IsObject()
  @Type(() => ChatRoleDto)
  @IsNotEmpty()
  role: ChatRoleDto
}
