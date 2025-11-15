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
import { CountriesService } from '../services/countries.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import {
  CountryDto,
  CountryListResponseDto,
  SyncResponseDto,
} from '../dto/country-response.dto';
import {
  ErrorResponseDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
  InternalServerErrorResponseDto,
} from 'src/common/dto/error-response.dto';

@ApiTags('Countries')
@Controller('countries')
@UseInterceptors(CacheInterceptor)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @CacheTTL(24 * 60 * 60 * 1000)
  @ApiOperation({ summary: 'Listar todos os países com paginação' })
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
    description: 'Lista de países retornada com sucesso',
    schema: {
      example: {
        data: [
          {
            countryKey: '1',
            name: 'USA',
            logo: 'https://example.com/usa.png',
            createdAt: '2025-01-15T10:30:00.000Z',
            updatedAt: '2025-01-15T10:30:00.000Z',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
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
    return this.countriesService.getAllCountries(paginationDto);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Buscar país por key' })
  @ApiParam({
    name: 'key',
    description: 'Identificador único do país',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'País encontrado com sucesso',
    type: CountryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'País não encontrado',
    type: NotFoundResponseDto,
  })
  async findByKey(@Param('key') key: string) {
    return this.countriesService.findByKey(key);
  }

  @Roles(UserRole.ADMIN)
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Sincronizar países da API externa (apenas ADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Países sincronizados com sucesso',
    type: SyncResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão (requer role ADMIN)',
    type: ForbiddenResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao sincronizar com a API externa',
    type: InternalServerErrorResponseDto,
  })
  async syncCountries() {
    return this.countriesService.syncCountries();
  }
}
