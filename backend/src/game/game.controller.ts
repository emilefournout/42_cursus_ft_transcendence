import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}
  
  @Get('info/:id')
  @ApiParam({name: 'id'})
  @ApiOperation({summary: "Return basic information about a game"})
  findGame(@Param('id', ParseUUIDPipe) id: string) {
    const game = this.gameService.findGameById(id);
    if (game === undefined)
    throw new NotFoundException('Game was not found');
    return game
  }

  @Get('active-plays')
  @ApiOperation({summary: "Return the games that can be watched"})
  @ApiResponse({type: [String]})
  getActiveGame() : string[] {
    return this.gameService.findActiveGames();
  }

  @Get('/invitations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets user game invitations.',
    description: 'If no invitations are found, 404 will be returned'
  })
  async getUserInvitations(@GetUser() user) {
    return await this.gameService.getUserInvitations(user.sub);
  }
}
