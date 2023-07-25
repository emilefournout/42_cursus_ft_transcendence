import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateChatMemberDto {
    @ApiProperty()
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    id: number

    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    password?: string
}
