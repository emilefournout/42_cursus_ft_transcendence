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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get(':id')
  @ApiParam({name: 'id'})
  @ApiOperation({summary: "Return basic information about a game"})
  findGame(@Param('id', ParseUUIDPipe) id: string) {
    const game = this.gameService.findGameById(id);
    if (game === undefined)
      throw new NotFoundException('Game was not found');
    return game
  }

  @Post()
  @ApiOperation({summary: "[NOT IMPLEMENTED] Creates a a game."})
  createGame(@Body() createGameDto: CreateGameDto) {
    throw new NotImplementedException();
  }

  @Patch(':id')
  @ApiParam({name: 'id'})
  @ApiOperation({summary: "[NOT IMPLEMENTED] Updates information from a game."})
  updateGame(@Param('id', ParseUUIDPipe) id) {
    throw new NotImplementedException();
  }

  @Delete(':id')
  @ApiParam({name: 'id'})
  @ApiOperation({summary: "[NOT IMPLEMENTED] Deletes information from a game."})
  deleteGame(@Param('id', ParseUUIDPipe) id) {
    throw new NotImplementedException();
  }
}
