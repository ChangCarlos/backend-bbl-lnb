import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { H2hService } from '../services/h2h.service';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('H2H')
@Controller('h2h')
export class H2hController {
  constructor(private readonly h2hService: H2hService) {}

  @Public()
  @Get(':firstTeamId/:secondTeamId')
  @ApiOperation({
    summary:
      'Buscar histórico de confrontos diretos entre dois times (H2H - Head to Head)',
  })
  @ApiParam({
    name: 'firstTeamId',
    description: 'Identificador do primeiro time',
    example: '1234',
  })
  @ApiParam({
    name: 'secondTeamId',
    description: 'Identificador do segundo time',
    example: '1235',
  })
  @ApiResponse({
    status: 200,
    description: 'Histórico de confrontos retornado com sucesso',
    schema: {
      example: {
        firstTeamId: '1234',
        secondTeamId: '1235',
        totalGames: 25,
        firstTeamWins: 15,
        secondTeamWins: 10,
        lastFiveGames: [
          {
            fixtureKey: 'fixture123',
            date: '2025-01-10',
            homeTeamKey: '1234',
            awayTeamKey: '1235',
            homeScore: 110,
            awayScore: 105,
            winner: '1234',
          },
          {
            fixtureKey: 'fixture122',
            date: '2024-12-15',
            homeTeamKey: '1235',
            awayTeamKey: '1234',
            homeScore: 98,
            awayScore: 102,
            winner: '1234',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'IDs dos times não fornecidos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Both team IDs must be provided',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Times não encontrados ou sem histórico de confrontos',
    schema: {
      example: {
        statusCode: 404,
        message: 'No head-to-head data found for these teams',
        error: 'Not Found',
      },
    },
  })
  async getH2H(
    @Param('firstTeamId') firstTeamId: string,
    @Param('secondTeamId') secondTeamId: string,
  ) {
    if (!firstTeamId || !secondTeamId) {
      throw new BadRequestException('Both team IDs must be provided');
    }

    return this.h2hService.getH2H(firstTeamId, secondTeamId);
  }
}
