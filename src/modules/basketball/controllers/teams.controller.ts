import {
  BadRequestException,
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
import { TeamsService } from '../services/teams.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@ApiTags('Teams')
@Controller('teams')
@UseInterceptors(CacheInterceptor)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @CacheTTL(12 * 60 * 60 * 1000)
  @ApiOperation({ summary: 'Listar todos os times com paginação' })
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
    description: 'Lista de times retornada com sucesso',
    schema: {
      example: {
        data: [
          {
            teamKey: '1234',
            name: 'Los Angeles Lakers',
            leagueKey: '766',
            logo: 'https://example.com/lakers.png',
            createdAt: '2025-01-15T10:30:00.000Z',
            updatedAt: '2025-01-15T10:30:00.000Z',
          },
        ],
        meta: {
          total: 250,
          page: 1,
          limit: 10,
          totalPages: 25,
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
        message: ['page must be a positive number'],
        error: 'Bad Request',
      },
    },
  })
  async findAll(@Query() paginationDto?: PaginationDto) {
    return this.teamsService.findAll(paginationDto);
  }

  @Get('league/:leagueKey')
  @ApiOperation({ summary: 'Listar times por liga' })
  @ApiParam({
    name: 'leagueKey',
    description: 'Identificador da liga',
    example: '766',
  })
  @ApiResponse({
    status: 200,
    description: 'Times da liga retornados com sucesso',
    schema: {
      example: [
        {
          teamKey: '1234',
          name: 'Los Angeles Lakers',
          leagueKey: '766',
          logo: 'https://example.com/lakers.png',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T10:30:00.000Z',
        },
        {
          teamKey: '1235',
          name: 'Boston Celtics',
          leagueKey: '766',
          logo: 'https://example.com/celtics.png',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T10:30:00.000Z',
        },
      ],
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
  async findByLeague(@Param('leagueKey') leagueKey: string) {
    return this.teamsService.findByLeague(leagueKey);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Buscar time por key' })
  @ApiParam({
    name: 'key',
    description: 'Identificador único do time',
    example: '1234',
  })
  @ApiResponse({
    status: 200,
    description: 'Time encontrado com sucesso',
    schema: {
      example: {
        teamKey: '1234',
        name: 'Los Angeles Lakers',
        leagueKey: '766',
        logo: 'https://example.com/lakers.png',
        createdAt: '2025-01-15T10:30:00.000Z',
        updatedAt: '2025-01-15T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Time não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Team not found',
        error: 'Not Found',
      },
    },
  })
  async findByKey(@Param('key') key: string) {
    return this.teamsService.findByKey(key);
  }

  @Roles(UserRole.ADMIN)
  @Post('sync/:leagueKey')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Sincronizar times de uma liga da API externa (apenas ADMIN)',
  })
  @ApiParam({
    name: 'leagueKey',
    description: 'Identificador da liga para sincronizar times',
    example: '766',
  })
  @ApiResponse({
    status: 200,
    description: 'Times sincronizados com sucesso',
    schema: {
      example: {
        message: 'Teams synced successfully for league 766',
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
        message: 'League ID is required for synchronization.',
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
        message: 'Failed to sync teams from external API',
        error: 'Internal Server Error',
      },
    },
  })
  async syncTeams(@Param('leagueKey') leagueKey: string) {
    if (!leagueKey) {
      throw new BadRequestException(
        'League ID is required for synchronization.',
      );
    }
    return this.teamsService.syncTeams(leagueKey);
  }
}
