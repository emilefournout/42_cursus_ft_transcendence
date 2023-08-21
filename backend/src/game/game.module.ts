import { Module, forwardRef } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway, UserService],
  imports: [forwardRef(() =>AuthModule)],
  exports: [GameService]
})
export class GameModule {}
