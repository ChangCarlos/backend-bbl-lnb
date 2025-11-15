import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Public()
  @Get()
  async findAll() {
    return this.teamsService.findAll();
  }

  @Get('league/:leagueKey')
  async findByLeague(@Param('leagueKey') leagueKey: string) {
    return this.teamsService.findByLeague(leagueKey);
  }

  @Get(':key')
  async findByKey(@Param('key') key: string) {
    return this.teamsService.findByKey(key);
  }

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
