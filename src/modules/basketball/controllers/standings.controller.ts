import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { StandingsService } from '../services/standings.service';

@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get('league/:key')
  async findByLeague(
    @Param('key') key: string,
    @Query('season') season?: string,
  ) {
    if (season) {
      return this.standingsService.findByLeagueAndSeason(key, season);
    }
    return this.standingsService.findByLeague(key);
  }

  @Post('sync/:leagueId')
  async syncStandings(@Param('leagueId') leagueId: string) {
    if (!leagueId) {
      throw new BadRequestException('leagueId is required');
    }
    return this.standingsService.syncStandings(leagueId);
  }
}
