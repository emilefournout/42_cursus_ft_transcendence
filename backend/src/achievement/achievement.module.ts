import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';

@Module({
  imports: [],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService]
})
export class AchievementsModule {}
