import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { AchievementService } from './achievement.service';
import { AchievementDto } from './dto/achievement.dto';

@ApiTags("Achievements")
@Controller('achievements')
export class AchievementController {
    constructor(private achievementService: AchievementService) {}

    @Get("")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Finds the achievements from a given user' })
    @ApiResponse({type: [AchievementDto]})
    async getUserAchievements(@GetUser() user) : Promise<AchievementDto[]>{
        return this.achievementService.findAchievementsFromUser(user.sub)
    }

    @Get("all")
    @ApiOperation({ summary: 'Finds all the achievements available' })
    @ApiResponse({type: [AchievementDto]})
    async getAllAchievements() : Promise<AchievementDto[]>{
        return this.achievementService.findAllAchievements()
    }

}
