import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateGameDto } from './dto/game.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get(':id')
  findGame(@Param('id', ParseIntPipe) id) {
    return this.gameService.findGameById(id);
  }

  @Post()
  createGame(@Body() createGameDto: CreateGameDto) {}

  @Patch(':id')
  updateGame(@Param('id', ParseIntPipe) id) {}

  @Delete(':id')
  deleteGame(@Param('id', ParseIntPipe) id) {}
}
