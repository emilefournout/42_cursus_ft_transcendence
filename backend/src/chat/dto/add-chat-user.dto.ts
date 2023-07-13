import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddChatUserDto {
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    id: number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    password?: string
}
