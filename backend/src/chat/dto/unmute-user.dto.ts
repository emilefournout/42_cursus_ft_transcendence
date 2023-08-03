import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UnmuteUserDto {
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    @ApiProperty()
    userId: number

}
