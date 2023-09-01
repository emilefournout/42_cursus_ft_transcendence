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
} from '@nestjs/common';
import { GameService } from './game.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

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
}
