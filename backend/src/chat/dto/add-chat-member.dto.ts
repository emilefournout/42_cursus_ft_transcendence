import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddChatMemberDto {
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    @ApiProperty()
    id: number
}
