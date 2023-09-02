import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsNotEmpty, IsNumber, IsString, Min } from "class-validator"

export class AssignAchievementDto {
    @ApiProperty()
    @IsDefined()
    @IsNumber()
    @IsNotEmpty()
    @Min(2)
    id: number
    
    @ApiProperty()
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    achievementName: string
}
