import { GameStatus } from "@prisma/client"
import { IsBoolean, IsDefined, IsNumber, Max, Min } from "class-validator"

export class CreateGameDto {
    @IsDefined()
    @IsNumber()
    @Min(5)
    @Max(25)
    maxGoals: number
    
    @IsDefined()
    @IsNumber()
    @IsBoolean()
    powerUps: boolean
    
    @IsDefined()
    @IsNumber()
    @Min(0.75)
    @Max(1.25)
    speed: number
}

export class CreatePrivateGameDto {
    @IsDefined()
    gameDto: CreateGameDto

    @IsDefined()
    @IsNumber()
    @Min(2)
    invitedId: number
}
