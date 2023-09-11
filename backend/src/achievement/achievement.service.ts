import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AchievementDto } from './dto/achievement.dto';
import { GameState } from 'src/game/types/game-state.class';

@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService) {}

  async findAllAchievements(): Promise<AchievementDto[]> {
    const achievements = await this.prisma.achievement.findMany();
    return achievements == null
      ? []
      : achievements.map((achievement) =>
          AchievementDto.fromAchievement(achievement)
        );
  }

  async findAchievementsFromUser(userId: number) {
    const userWithAchievements = await this.prisma.user.findFirst({
      include: {
        achievements: true,
      },
      where: {
        id: userId,
      },
    });
    const userAchievements =
      userWithAchievements == null
        ? []
        : userWithAchievements.achievements.map((achievement) =>
            AchievementDto.fromAchievement(achievement)
          );
    return userAchievements;
  }

  async checkAndGrantGameAchievements(game: GameState) {
    const user1 = await this.prisma.user.findFirst({
      where: { id: game.firstPlayer.id },
    });
    const user2 = await this.prisma.user.findFirst({
      where: { id: game.secondPlayer.id },
    });
    if (!user1 || !user2) return; // TODO Error message

    for (const user of [user1, user2]) {
      if (user.wins === 1) this.grantGameAchievement(user.id, 'First Win');
      if (user.wins === 10)
        this.grantGameAchievement(user.id, 'Esport Trainee');
    }
    if (game.firstPlayerScore === 0)
      this.grantGameAchievement(game.secondPlayer.id, 'What A Player');
    if (game.secondPlayerScore === 0)
      this.grantGameAchievement(game.firstPlayer.id, 'What A Player');
  }

  private async grantGameAchievement(
    userId: number,
    achievementName: string
  ): Promise<void> {
    const achievement = await this.prisma.achievement.findFirst({
      where: { name: achievementName },
    });

    if (achievement) {
      try {
        await this.prisma.achievement.update({
          where: {
            name: achievementName,
          },
          data: {
            users: { connect: { id: userId } },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
