import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';

@Module({
  imports: [],
  providers: [AchievementService],
  controllers: [AchievementController]
})
export class AchievementsModule {}
