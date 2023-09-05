import { ApiProperty } from '@nestjs/swagger';
import { Achievement } from '@prisma/client';

export class AchievementDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  public static fromAchievement(achievement: Achievement) {
    const newAchievement = new AchievementDto();
    newAchievement.name = achievement.name;
    newAchievement.description = achievement.description;
    return newAchievement;
  }
}
