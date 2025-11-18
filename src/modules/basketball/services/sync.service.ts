import { Injectable, Logger } from '@nestjs/common';
import { StandingsService } from './standings.service';
import { FixturesService } from './fixtures.service';
import { TeamsService } from './teams.service';
import { LeaguesService } from './leagues.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly leaguesService: LeaguesService,
    private readonly teamsService: TeamsService,
    private readonly standingsService: StandingsService,
    private readonly fixturesService: FixturesService,
  ) {}

  async syncAll(leagueKey?: string) {
    const startTime = Date.now();
    this.logger.log('Iniciando sincronização completa...');

    const results = {
      leagues: 0,
      teams: 0,
      standings: 0,
      fixtures: 0,
      errors: [] as string[],
    };

    try {
      const leagueKeys = leagueKey
        ? [leagueKey]
        : [
            process.env.LEAGUE_API_KEY_BBL || '757',
            process.env.LEAGUE_API_KEY_LNB || '756',
          ];

      for (const key of leagueKeys) {
        this.logger.log(`Sincronizando liga ${key}...`);

        try {
          this.logger.log('Sincronizando informações da liga...');
          const leagueResult = await this.leaguesService.syncLeagues(key);
          results.leagues += leagueResult.synced;

          this.logger.log('Sincronizando times...');
          const teamsResult = await this.teamsService.syncTeams(key);
          results.teams += teamsResult.synced;

          this.logger.log('Sincronizando classificação...');
          const standingsResult =
            await this.standingsService.syncStandings(key);
          results.standings += standingsResult.synced;

          this.logger.log('Sincronizando jogos...');
          const today = new Date();
          const from = new Date(today);
          from.setDate(today.getDate() - 30);
          const to = new Date(today);
          to.setDate(today.getDate() + 7);

          const fixturesResult = await this.fixturesService.syncFixtures({
            from: from.toISOString().split('T')[0],
            to: to.toISOString().split('T')[0],
            leagueId: key,
          });
          results.fixtures += fixturesResult.synced;

          this.logger.log(`Liga ${key} sincronizada com sucesso!`);
        } catch (error) {
          results.errors.push(`Erro na liga ${key}: ${error.message}`);
          this.logger.error(`Erro na liga ${key}:`, error);
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(
        `Sincronização completa finalizada em ${duration}ms. Resultados: ${JSON.stringify(results)}`,
      );

      return {
        success: true,
        duration,
        results,
        message: 'Sincronização completa realizada com sucesso',
      };
    } catch (error) {
      this.logger.error('Erro na sincronização completa:', error);
      throw error;
    }
  }

  async syncLeague(leagueKey: string) {
    return this.syncAll(leagueKey);
  }
}
