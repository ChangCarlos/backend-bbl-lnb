import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Public()
  @Get()
  async findAll(@Query() paginationDto?: PaginationDto) {
    return this.teamsService.findAll(paginationDto);
  }

  @Get('league/:leagueKey')
  async findByLeague(@Param('leagueKey') leagueKey: string) {
    return this.teamsService.findByLeague(leagueKey);
  }

  @Get(':key')
  async findByKey(@Param('key') key: string) {
    return this.teamsService.findByKey(key);
  }

  @Public()
  @Post('sync/:leagueKey')
  @HttpCode(HttpStatus.OK)
  async syncTeams(@Param('leagueKey') leagueKey: string) {
    if (!leagueKey) {
      throw new BadRequestException(
        'League ID is required for synchronization.',
      );
    }
    return this.teamsService.syncTeams(leagueKey);
  }
}
