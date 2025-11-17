import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PlayersService } from '../services/players.service';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Players')
@Controller('players')
@UseInterceptors(CacheInterceptor)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Public()
  @Get('team/:teamKey')
  @CacheTTL(60 * 60 * 1000)
  @ApiOperation({
    summary: 'Buscar jogadores de um time com estatísticas médias',
  })
  @ApiParam({
    name: 'teamKey',
    description: 'Identificador do time',
    example: '389',
  })
  @ApiResponse({
    status: 200,
    description: 'Jogadores retornados com sucesso',
    schema: {
      example: [
        {
          playerId: '12345',
          name: 'LeBron James',
          teamKey: '389',
          gamesPlayed: 50,
          avgPoints: 25.4,
          avgRebounds: 7.8,
          avgAssists: 8.2,
          avgSteals: 1.3,
          avgBlocks: 0.6,
          avgMinutes: 35.2,
          fgPercentage: 52.3,
          threePointPercentage: 38.5,
          ftPercentage: 75.6,
        },
      ],
    },
  })
  async getPlayersByTeam(@Param('teamKey') teamKey: string) {
    return this.playersService.getPlayersByTeam(teamKey);
  }

  @Public()
  @Get('fixture/:fixtureId')
  @CacheTTL(60 * 60 * 1000)
  @ApiOperation({
    summary: 'Buscar estatísticas dos jogadores de uma partida específica',
  })
  @ApiParam({
    name: 'fixtureId',
    description: 'ID da partida',
    example: 'uuid-here',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      example: {
        homeTeam: {
          teamKey: '389',
          teamName: 'Alba Berlin',
          players: [
            {
              playerId: '12345',
              playerName: 'Player Name',
              minutes: '35',
              points: '25',
              rebounds: '8',
              assists: '5',
              steals: '2',
              blocks: '1',
            },
          ],
        },
        awayTeam: {
          teamKey: '399',
          teamName: 'Bayern',
          players: [],
        },
      },
    },
  })
  async getFixturePlayerStats(@Param('fixtureId') fixtureId: string) {
    return this.playersService.getFixturePlayerStats(fixtureId);
  }
}
