import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class AssignAchievementDto {
    @ApiProperty()
    @IsDefined()
    @IsNumber()
    @IsNotEmpty()
    id: number
    
    @ApiProperty()
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    achievementName: string
}
