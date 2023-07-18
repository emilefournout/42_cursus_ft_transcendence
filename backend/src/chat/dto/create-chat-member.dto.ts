import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateChatMemberDto {
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    id: number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    password?: string
}
