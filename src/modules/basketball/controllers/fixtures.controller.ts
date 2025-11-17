import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { FixturesService } from '../services/fixtures.service';
import { FixturesQueryDto } from '../dto/fixturesQuery.dto';
import { FixtureFiltersDto } from '../dto/fixture-filters.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@ApiTags('Fixtures')
@Controller('fixtures')
@UseInterceptors(CacheInterceptor)
export class FixturesController {
  constructor(private readonly fixturesService: FixturesService) {}

  @Get()
  @CacheTTL(5 * 60 * 1000)
  @ApiOperation({
    summary: 'Listar fixtures com filtros opcionais e paginação',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de fixtures retornada com sucesso',
    schema: {
      example: {
        data: [
          {
            fixtureKey: 'fixture123',
            date: '2025-01-20',
            time: '19:00',
            leagueKey: '766',
            homeTeamKey: '1234',
            awayTeamKey: '1235',
            status: 'Finished',
            createdAt: '2025-01-15T10:30:00.000Z',
            updatedAt: '2025-01-15T10:30:00.000Z',
          },
        ],
        meta: {
          total: 500,
          page: 1,
          limit: 10,
          totalPages: 50,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['date must be a valid ISO 8601 date string'],
        error: 'Bad Request',
      },
    },
  })
  async findAll(@Query() filters: FixtureFiltersDto) {
    const { leagueKey, teamKey, date, page, limit } = filters;
    return this.fixturesService.findAll(
      { leagueKey, teamKey, date },
      { page, limit },
    );
  }

  @Get(':key')
  @CacheTTL(5 * 60 * 1000)
  @ApiOperation({
    summary:
      'Buscar fixture completo por key (com estatísticas, lineups, etc.)',
  })
  @ApiParam({
    name: 'key',
    description: 'Identificador único do fixture',
    example: 'fixture123',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fixture encontrado com sucesso (inclui scores, statistics, lineups, playerStatistics)',
    schema: {
      example: {
        fixtureKey: 'fixture123',
        date: '2025-01-20',
        time: '19:00',
        leagueKey: '766',
        homeTeamKey: '1234',
        awayTeamKey: '1235',
        status: 'Finished',
        scores: [
          {
            scoreType: 'final',
            homeScore: 110,
            awayScore: 105,
          },
        ],
        statistics: [
          {
            statisticType: 'field_goals',
            homeValue: '45/90',
            awayValue: '42/88',
          },
        ],
        lineups: [
          {
            playerKey: 'player123',
            playerName: 'LeBron James',
            position: 'SF',
          },
        ],
        playerStatistics: [
          {
            playerKey: 'player123',
            playerName: 'LeBron James',
            points: 28,
            rebounds: 10,
            assists: 8,
          },
        ],
        createdAt: '2025-01-15T10:30:00.000Z',
        updatedAt: '2025-01-15T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Fixture não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Fixture not found',
        error: 'Not Found',
      },
    },
  })
  async findByKey(@Param('key') key: string) {
    return this.fixturesService.findByKey(key);
  }

  @Roles(UserRole.ADMIN)
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Sincronizar fixtures de uma liga em um período (apenas ADMIN)',
  })
  @ApiBody({
    type: FixturesQueryDto,
    description: 'Parâmetros de sincronização de fixtures',
    examples: {
      nba: {
        summary: 'Sincronizar NBA última semana',
        value: {
          leagueId: '766',
          from: '2025-01-10',
          to: '2025-01-17',
        },
      },
      futureGames: {
        summary: 'Sincronizar próximos jogos',
        value: {
          leagueId: '766',
          from: '2025-01-15',
          to: '2025-01-22',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Fixtures sincronizados com sucesso',
    schema: {
      example: {
        message: 'Fixtures synced successfully',
        synced: 45,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros obrigatórios não fornecidos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Os parâmetros "from" e "to" são obrigatórios.',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão (requer role ADMIN)',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Liga ou times não encontrados',
    schema: {
      example: {
        statusCode: 404,
        message: 'League not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao sincronizar com a API externa',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to sync fixtures from external API',
        error: 'Internal Server Error',
      },
    },
  })
  async syncFixtures(@Body() query: FixturesQueryDto) {
    if (!query.from || !query.to) {
      throw new BadRequestException(
        'Os parâmetros "from" e "to" são obrigatórios.',
      );
    }
    return this.fixturesService.syncFixtures(query);
  }
}
