import { Module, forwardRef } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { AchievementsModule } from 'src/achievement/achievement.module';
import { AchievementService } from 'src/achievement/achievement.service';

@Module({
  imports: [AchievementsModule, forwardRef(() => AuthModule)],
  providers: [GameService, GameGateway, UserService, AchievementService],
  controllers: [GameController],
  exports: [GameService]
})
export class GameModule {}
