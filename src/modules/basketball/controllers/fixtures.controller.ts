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
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { FixturesService } from '../services/fixtures.service';
import { FixturesQueryDto } from '../dto/fixturesQuery.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('fixtures')
@UseInterceptors(CacheInterceptor)
export class FixturesController {
  constructor(private readonly fixturesService: FixturesService) {}

  @Get()
  @CacheTTL(5 * 60 * 1000)
  async findAll(
    @Query('leagueKey') leagueKey?: string,
    @Query('teamKey') teamKey?: string,
    @Query('date') date?: string,
    @Query() paginationDto?: PaginationDto,
  ) {
    const filters = { leagueKey, teamKey, date };
    const pagination = {
      page: paginationDto?.page,
      limit: paginationDto?.limit,
    };
    return this.fixturesService.findAll(filters, pagination);
  }

  @Get(':key')
  @CacheTTL(5 * 60 * 1000)
  async findByKey(@Param('key') key: string) {
    return this.fixturesService.findByKey(key);
  }

  @Roles(UserRole.ADMIN)
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncFixtures(@Body() query: FixturesQueryDto) {
    if (!query.from || !query.to) {
      throw new BadRequestException(
        'Os parâmetros "from" e "to" são obrigatórios.',
      );
    }
    return this.fixturesService.syncFixtures(query);
  }
}
