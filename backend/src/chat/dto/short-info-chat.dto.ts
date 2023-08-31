import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ChatVisibility } from "@prisma/client";
import { ChatMemberBasicInfoDto } from "./info-chat-member.dto";

export class ChatShortInfoDto {
  @ApiProperty({
    type: Number,
    description: "Identification number of the chat"
  })
  id: number;

  @ApiPropertyOptional({
    type: String,
    description: "Name of the chat"
  })
  name: string;
  
  @ApiProperty({
    enum: ChatVisibility,
    description: "Visibility of the chat"
  })
  visibility: ChatVisibility;

  public static fromChat(chat) {
    const chatInfo = new ChatShortInfoDto();
    chatInfo.id = chat.id;
    chatInfo.name = chat.name;
    chatInfo.visibility = chat.visibility;
    return chatInfo;
  }
}
