import {ApiProperty} from '@nestjs/swagger';
import {Achievement, AchievementRarity} from '@prisma/client';

export class AchievementDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  rarity: AchievementRarity;

  public static fromAchievement(achievement: Achievement) {
    const newAchievement = new AchievementDto();
    newAchievement.name = achievement.name;
    newAchievement.description = achievement.description;
    newAchievement.rarity = achievement.rarity;
    return newAchievement;
  }
}
