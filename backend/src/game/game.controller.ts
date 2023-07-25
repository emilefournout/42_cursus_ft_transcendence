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
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @ApiParam({name: 'id'})
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

  @ApiParam({name: 'id'})
  @Patch(':id')
  updateGame(@Param('id', ParseUUIDPipe) id) {
    throw new NotImplementedException();
  }

  @ApiParam({name: 'id'})
  @Delete(':id')
  deleteGame(@Param('id', ParseUUIDPipe) id) {
    throw new NotImplementedException();
  }
}
