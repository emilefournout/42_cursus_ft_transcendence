import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatMember, ChatVisibility } from '@prisma/client';

export class ChatMemberBasicInfoDto {
  @ApiProperty({
    type: Number,
    description: 'User identificator',
  })
  userId: number;

  @ApiProperty({
    type: String,
    description: 'Username',
  })
  username: string;

  @ApiProperty({
    type: Date,
    description: 'Creation Date',
  })
  createdAt: Date;

  @ApiProperty({
    type: Boolean,
    description: 'Owner of the chat',
  })
  owner: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Administrator',
  })
  administrator: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Muted',
  })
  muted: boolean;

  @ApiProperty({
    type: Date,
    description: 'Muted',
  })
  mutedExpiringDate: Date;

  public static fromChatMember(chatMember) {
    const chatMemberInfo = new ChatMemberBasicInfoDto();
    chatMemberInfo.userId = chatMember.userId;
    chatMemberInfo.username = chatMember.user.username;
    chatMemberInfo.createdAt = chatMember.createdAt;
    chatMemberInfo.administrator = chatMember.administrator;
    chatMemberInfo.owner = chatMember.owner;
    chatMemberInfo.muted = chatMember.muted;
    chatMemberInfo.mutedExpiringDate = chatMember.mutedExpiringDate;
    return chatMemberInfo;
  }
}
