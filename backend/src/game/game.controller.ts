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
import { CreateGameDto } from './dto/game.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get(':id')
  findGame(@Param('id', ParseUUIDPipe) id: string) {
    const game = this.gameService.findGameById(id);
    if (game === undefined)
      throw new NotFoundException('Game was not found');
    return game
  }

  @Post()
  createGame(@Body() createGameDto: CreateGameDto) {
    throw new NotImplementedException();
  }

  @Patch(':id')
  updateGame(@Param('id', ParseUUIDPipe) id) {
    throw new NotImplementedException();
  }

  @Delete(':id')
  deleteGame(@Param('id', ParseUUIDPipe) id) {
    throw new NotImplementedException();
  }
}
