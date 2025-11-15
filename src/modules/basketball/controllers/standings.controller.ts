import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { StandingsService } from '../services/standings.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('standings')
@UseInterceptors(CacheInterceptor)
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get('league/:key')
  @CacheTTL(30 * 60 * 1000)
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
  async syncStandings(@Param('leagueId') leagueId: string) {
    if (!leagueId) {
      throw new BadRequestException('leagueId is required');
    }
    return this.standingsService.syncStandings(leagueId);
  }
}
