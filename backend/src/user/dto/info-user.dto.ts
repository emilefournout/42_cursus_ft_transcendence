import { ApiProperty } from "@nestjs/swagger";
import { OnlineStatus } from "@prisma/client";

export class UserBasicInfoDto {
  @ApiProperty({
    type: Number,
    description: "Identification number of the user"
  })
  id: number;

  @ApiProperty()
  username: string;
  
  @ApiProperty()
  avatar: string;

  @ApiProperty()
  status: OnlineStatus;

  public static fromUser(user) {
    const userInfo = new UserBasicInfoDto();
    userInfo.id = user.id;
    userInfo.username = user.username;
    userInfo.status = user.status;
    userInfo.avatar = user.avatarURL;
    return userInfo;
  }
}
