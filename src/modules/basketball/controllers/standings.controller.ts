import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { StandingsService } from '../services/standings.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@ApiTags('Standings')
@Controller('standings')
@UseInterceptors(CacheInterceptor)
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get('league/:key')
  @CacheTTL(30 * 60 * 1000)
  @ApiOperation({
    summary:
      'Buscar tabela de classificação por liga (com filtro opcional de temporada)',
  })
  @ApiParam({
    name: 'key',
    description: 'Identificador da liga',
    example: '766',
  })
  @ApiQuery({
    name: 'season',
    required: false,
    description: 'Filtrar por temporada específica',
    example: '2024-2025',
  })
  @ApiResponse({
    status: 200,
    description: 'Tabela de classificação retornada com sucesso',
    schema: {
      example: [
        {
          leagueKey: '766',
          season: '2024-2025',
          teamKey: '1234',
          teamName: 'Los Angeles Lakers',
          position: 1,
          played: 50,
          won: 35,
          lost: 15,
          winPercentage: 0.7,
          streak: 'W3',
          conference: 'Western',
          division: 'Pacific',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T10:30:00.000Z',
        },
        {
          leagueKey: '766',
          season: '2024-2025',
          teamKey: '1235',
          teamName: 'Boston Celtics',
          position: 2,
          played: 50,
          won: 33,
          lost: 17,
          winPercentage: 0.66,
          streak: 'L1',
          conference: 'Eastern',
          division: 'Atlantic',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T10:30:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Liga não encontrada ou sem standings disponíveis',
    schema: {
      example: {
        statusCode: 404,
        message: 'League not found or no standings available',
        error: 'Not Found',
      },
    },
  })
  async findByLeague(
    @Param('key') key: string,
    @Query('season') season?: string,
  ) {
    if (season) {
      return this.standingsService.findByLeagueAndSeason(key, season);
    }
    return this.standingsService.findByLeague(key);
  }

  @Roles(UserRole.ADMIN)
  @Post('sync/:leagueId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Sincronizar tabela de classificação de uma liga (apenas ADMIN)',
  })
  @ApiParam({
    name: 'leagueId',
    description: 'Identificador da liga para sincronizar standings',
    example: '766',
  })
  @ApiResponse({
    status: 200,
    description: 'Standings sincronizados com sucesso',
    schema: {
      example: {
        message: 'Standings synced successfully for league 766',
        synced: 30,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'League ID não fornecido',
    schema: {
      example: {
        statusCode: 400,
        message: 'leagueId is required',
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
    description: 'Liga não encontrada',
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
        message: 'Failed to sync standings from external API',
        error: 'Internal Server Error',
      },
    },
  })
  async syncStandings(@Param('leagueId') leagueId: string) {
    if (!leagueId) {
      throw new BadRequestException('leagueId is required');
    }
    return this.standingsService.syncStandings(leagueId);
  }
}
