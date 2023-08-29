import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { AchievementsModule } from './achievement/achievement.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
    UserModule,
    ChatModule,
    GameModule,
    AuthModule,
    PrismaModule,
    ProfileModule,
    AchievementsModule]
  })
export class AppModule {}
