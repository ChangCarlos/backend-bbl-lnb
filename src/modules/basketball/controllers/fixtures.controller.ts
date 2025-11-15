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
} from '@nestjs/common';
import { FixturesService } from '../services/fixtures.service';
import { Public } from 'src/common/decorators/public.decorator';
import { FixturesQueryDto } from '../dto/fixturesQuery.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('fixtures')
export class FixturesController {
  constructor(private readonly fixturesService: FixturesService) {}

  @Public()
  @Get()
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

  @Public()
  @Get(':key')
  async findByKey(@Param('key') key: string) {
    return this.fixturesService.findByKey(key);
  }

  @Public()
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
