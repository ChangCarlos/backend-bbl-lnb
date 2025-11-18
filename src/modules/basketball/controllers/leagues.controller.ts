import {
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
} from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { LeaguesService } from '../services/leagues.service';
import { LeagueStatsService } from '../services/league-stats.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@ApiTags('Leagues')
@Controller('leagues')
@UseInterceptors(CacheInterceptor)
export class LeaguesController {
  constructor(
    private readonly leaguesService: LeaguesService,
    private readonly leagueStatsService: LeagueStatsService,
  ) {}

  @Get()
  @CacheTTL(24 * 60 * 60 * 1000)
  @ApiOperation({ summary: 'Listar todas as ligas com paginação' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página (padrão: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Itens por página (padrão: 10, máximo: 100)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ligas retornada com sucesso',
    schema: {
      example: {
        data: [
          {
            leagueKey: '766',
            name: 'NBA',
            countryKey: '1',
            logo: 'https://example.com/nba.png',
            createdAt: '2025-01-15T10:30:00.000Z',
            updatedAt: '2025-01-15T10:30:00.000Z',
          },
        ],
        meta: {
          total: 100,
          page: 1,
          limit: 10,
          totalPages: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de paginação inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['limit must not be greater than 100'],
        error: 'Bad Request',
      },
    },
  })
  async findAll(@Query() paginationDto?: PaginationDto) {
    return this.leaguesService.findAll(paginationDto);
  }

  @Get('country/:countryKey')
  @ApiOperation({ summary: 'Listar ligas por país' })
  @ApiParam({
    name: 'countryKey',
    description: 'Identificador do país',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Ligas do país retornadas com sucesso',
    schema: {
      example: [
        {
          leagueKey: '766',
          name: 'NBA',
          countryKey: '1',
          logo: 'https://example.com/nba.png',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T10:30:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'País não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Country not found',
        error: 'Not Found',
      },
    },
  })
  async findByCountry(@Param('countryKey') countryKey: string) {
    return this.leaguesService.findByCountry(countryKey);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Buscar liga por key' })
  @ApiParam({
    name: 'key',
    description: 'Identificador único da liga',
    example: '766',
  })
  @ApiResponse({
    status: 200,
    description: 'Liga encontrada com sucesso',
    schema: {
      example: {
        leagueKey: '766',
        name: 'NBA',
        countryKey: '1',
        logo: 'https://example.com/nba.png',
        createdAt: '2025-01-15T10:30:00.000Z',
        updatedAt: '2025-01-15T10:30:00.000Z',
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
  async findByKey(@Param('key') key: string) {
    return this.leaguesService.findByKey(key);
  }

  @Get(':key/stats')
  @CacheTTL(30 * 60 * 1000)
  @ApiOperation({ summary: 'Buscar estatísticas da liga' })
  @ApiParam({
    name: 'key',
    description: 'Identificador único da liga',
    example: '757',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      example: {
        totalTeams: 18,
        totalGames: 306,
        currentSeason: '2024-2025',
      },
    },
  })
  async getLeagueStats(@Param('key') key: string) {
    return this.leagueStatsService.getLeagueStats(key);
  }

  @Roles(UserRole.ADMIN)
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Sincronizar ligas da API externa (apenas ADMIN)',
  })
  @ApiQuery({
    name: 'countryId',
    required: false,
    description: 'Sincronizar apenas ligas de um país específico',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Ligas sincronizadas com sucesso',
    schema: {
      example: {
        message: 'Leagues synced successfully',
        synced: 15,
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
    status: 500,
    description: 'Erro ao sincronizar com a API externa',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to sync leagues from external API',
        error: 'Internal Server Error',
      },
    },
  })
  async syncLeagues(@Query('countryId') countryId?: string) {
    return this.leaguesService.syncLeagues(countryId);
  }
}
