import { IsDefined, IsNumber } from "class-validator"

export class UpdateGameDto {
    @IsDefined()
    @IsNumber()
    points_user1: number
    
    @IsDefined()
    @IsNumber()
    points_user2: number
}
