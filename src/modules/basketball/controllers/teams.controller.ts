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
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { TeamsService } from '../services/teams.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('teams')
@UseInterceptors(CacheInterceptor)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @CacheTTL(12 * 60 * 60 * 1000)
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

  @Roles(UserRole.ADMIN)
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
