import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FixturesService } from '../services/fixtures.service';
import { StandingsService } from '../services/standings.service';
import { LeaguesService } from '../services/leagues.service';

@Injectable()
export class BasketballCronService {
  private readonly logger = new Logger(BasketballCronService.name);

  constructor(
    private readonly fixturesService: FixturesService,
    private readonly standingsService: StandingsService,
    private readonly leaguesService: LeaguesService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async syncFixturesHourly() {
    this.logger.log('Iniciando sync automático de fixtures...');

    try {
      const leagues = await this.leaguesService.getAllActiveLeagues();

      if (leagues.length === 0) {
        this.logger.warn('Nenhuma liga encontrada para sincronizar');
        return;
      }

      this.logger.log(`Sincronizando fixtures de ${leagues.length} ligas...`);

      const today = new Date();
      const from = new Date(today);
      from.setDate(today.getDate() - 2);
      const to = new Date(today);
      to.setDate(today.getDate() + 7);

      let totalSynced = 0;

      for (const league of leagues) {
        try {
          const result = await this.fixturesService.syncFixtures({
            leagueId: league.leagueKey,
            from: from.toISOString().split('T')[0],
            to: to.toISOString().split('T')[0],
          });

          totalSynced += result.synced;
          this.logger.log(
            `Liga ${league.name} (${league.leagueKey}): ${result.synced} fixtures sincronizadas`,
          );
        } catch (error) {
          this.logger.error(
            `Erro ao sincronizar fixtures da liga ${league.name}: ${error.message}`,
          );
        }
      }

      this.logger.log(
        `Sync total concluído: ${totalSynced} fixtures sincronizadas de ${leagues.length} ligas`,
      );
    } catch (error) {
      this.logger.error(`Erro no sync de fixtures: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncStandingsDaily() {
    this.logger.log('Iniciando sync automático de standings...');

    try {
      const leagues = await this.leaguesService.getAllActiveLeagues();

      if (leagues.length === 0) {
        this.logger.warn('Nenhuma liga encontrada para sincronizar');
        return;
      }

      this.logger.log(`Sincronizando standings de ${leagues.length} ligas...`);

      let totalSynced = 0;

      for (const league of leagues) {
        try {
          const result = await this.standingsService.syncStandings(
            league.leagueKey,
          );

          totalSynced += result.synced;
          this.logger.log(
            `Liga ${league.name} (${league.leagueKey}): ${result.synced} posições sincronizadas`,
          );
        } catch (error) {
          this.logger.error(
            `Erro ao sincronizar standings da liga ${league.name}: ${error.message}`,
          );
        }
      }

      this.logger.log(
        `Sync total concluído: ${totalSynced} posições sincronizadas de ${leagues.length} ligas`,
      );
    } catch (error) {
      this.logger.error(`Erro no sync de standings: ${error.message}`);
    }
  }
}
