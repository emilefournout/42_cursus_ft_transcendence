import { Injectable } from '@nestjs/common';
import { GameService } from 'src/game/game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AchievementDto } from './dto/achievement.dto';

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
        achievements: true
      },
      where: {
        id: userId
      }
    });
    const userAchievements =
      userWithAchievements == null
        ? []
        : userWithAchievements.achievements.map((achievement) =>
            AchievementDto.fromAchievement(achievement)
          );
    return userAchievements;
  }

  async checkAndGrantGameAchievements(userId: number) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });

    if (user && user.wins === 1) this.grantGameAchievement(userId, 'First Win');
    if (await this.checkKOAchievement(userId))
      this.grantGameAchievement(userId, 'KO');
    if (user && user.wins === 10)
      this.grantGameAchievement(userId, 'eSport trainee');
  }

  // This function checks for some victory, not the first win
  private async checkFirstWin(userId: number): Promise<boolean> {
    const game = await this.prisma.$queryRaw`
        SELECT
        *
        FROM "Game" game
        WHERE (game."user1_id" = ${userId} AND game."points_user1" > game."points_user1")
        OR (game."user2_id" = ${userId} AND game."points_user2" > game."points_user1")
        `;
    return game !== null;
  }

  // This function checks if there is more than 10 wins, not the tenth win
  private async checkTenWins(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId
      }
    });
    return user && user.wins > 10;
  }

  private async checkKOAchievement(userId: number): Promise<boolean> {
    const game = await this.prisma.game.findFirst({
      where: {
        OR: [
          {
            AND: {
              user1_id: userId,
              points_user2: 0
            }
          },
          {
            AND: {
              user2_id: userId,
              points_user1: 0
            }
          }
        ]
      }
    });
    return game !== null;
  }

  private async grantGameAchievement(
    userId: number,
    achievementName: string
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        achievements: {
          where: {
            name: achievementName
          }
        }
      }
    });
    if (user && user.achievements.length) {
      await this.prisma.achievement.update({
        where: {
          name: achievementName
        },
        data: {
          users: {
            connect: {
              id: userId
            }
          }
        }
      });
    } else {
      await this.prisma.achievement.create({
        data: {
          name: achievementName,
          description: achievementName,
          users: {
            connect: {
              id: userId
            }
          }
        }
      });
    }
  }
}
