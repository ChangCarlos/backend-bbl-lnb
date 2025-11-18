import { Controller, Post, UseGuards, Query } from '@nestjs/common';
import { SyncService } from '../services/sync.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('basketball/sync')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  syncAll(@Query('leagueKey') leagueKey?: string) {
    return this.syncService.syncAll(leagueKey);
  }

  @Post('league')
  syncLeague(@Query('leagueKey') leagueKey: string) {
    if (!leagueKey) {
      throw new Error('leagueKey é obrigatório');
    }
    return this.syncService.syncLeague(leagueKey);
  }
}
