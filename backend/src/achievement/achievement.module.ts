import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { GameModule } from 'src/game/game.module';
import { UserModule } from 'src/user/user.module';
import { AchievementController } from './achievement.controller';

@Module({
  imports: [],
  providers: [AchievementService],
  controllers: [AchievementController]
})
export class AchievementsModule {}
