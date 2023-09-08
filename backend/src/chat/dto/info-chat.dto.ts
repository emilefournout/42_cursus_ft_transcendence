import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatVisibility } from '@prisma/client';
import { ChatMemberBasicInfoDto } from './info-chat-member.dto';

export class ChatBasicInfoDto {
  @ApiProperty({
    type: Number,
    description: 'Identification number of the chat',
  })
  id: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Name of the chat',
  })
  name: string;

  @ApiPropertyOptional({
    type: [ChatMemberBasicInfoDto],
    description: 'Members of the chat',
  })
  members: ChatMemberBasicInfoDto[];

  @ApiPropertyOptional({
    type: [ChatMemberBasicInfoDto],
    description: 'Users banned of the chat',
  })
  banned: ChatMemberBasicInfoDto[];

  @ApiProperty({
    enum: ChatVisibility,
    description: 'Visibility of the chat',
  })
  visibility: ChatVisibility;

  public static fromChat(chat, banned) {
    const chatInfo = new ChatBasicInfoDto();
    chatInfo.id = chat.id;
    chatInfo.name = chat.name;
    chatInfo.visibility = chat.visibility;
    chatInfo.banned = banned;

    if (chat.members)
      chatInfo.members = chat.members.map((chatMember) =>
        ChatMemberBasicInfoDto.fromChatMember(chatMember)
      );
    return chatInfo;
  }
}
