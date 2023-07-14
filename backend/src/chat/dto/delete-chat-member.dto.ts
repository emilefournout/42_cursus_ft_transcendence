import { IsDefined, IsNotEmpty, IsNumber } from "class-validator";

export class DeleteChatMemberDto {
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    id: number
}
