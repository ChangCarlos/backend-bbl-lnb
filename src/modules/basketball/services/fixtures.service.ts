import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { BasketballApiService } from './basketball-api.service';
import { FixturesQueryDto } from '../dto/fixturesQuery.dto';
import { PaginatedResult } from 'src/common/dto/pagination.dto';

@Injectable()
export class FixturesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly basketballApi: BasketballApiService,
  ) {}

  async syncFixtures(
    query: FixturesQueryDto,
  ): Promise<{ synced: number; message: string }> {
    const apiFixtures = await this.basketballApi.getFixtures(query);

    let syncedCount = 0;

    for (const apiFixture of apiFixtures) {
      const league = await this.prisma.league.findUnique({
        where: { leagueKey: String(apiFixture.league_key) },
      });

      if (!league) {
        console.warn(
          `Liga ${apiFixture.league_key} não encontrada. Sincronize as ligas primeiro.`,
        );
        continue;
      }

      const homeTeam = await this.prisma.team.findUnique({
        where: { teamKey: String(apiFixture.home_team_key) },
      });

      const awayTeam = await this.prisma.team.findUnique({
        where: { teamKey: String(apiFixture.away_team_key) },
      });

      if (!homeTeam || !awayTeam) {
        console.warn(
          `Times não encontrados para o jogo ${apiFixture.event_key}. Home: ${apiFixture.home_team_key}, Away: ${apiFixture.away_team_key}. Sincronize os times primeiro.`,
        );
        continue;
      }
      const fixture = await this.prisma.fixture.upsert({
        where: { eventKey: String(apiFixture.event_key) },
        update: {
          eventDate: apiFixture.event_date,
          eventTime: apiFixture.event_time,
          eventStatus: apiFixture.event_status,
          eventQuarter: apiFixture.event_quarter,
          finalResult: apiFixture.event_final_result,
          eventLive: apiFixture.event_live,
          homeTeamKey: String(apiFixture.home_team_key),
          awayTeamKey: String(apiFixture.away_team_key),
          leagueKey: String(apiFixture.league_key),
          leagueRound: apiFixture.league_round,
          leagueSeason: apiFixture.league_season,
        },
        create: {
          eventKey: String(apiFixture.event_key),
          eventDate: apiFixture.event_date,
          eventTime: apiFixture.event_time,
          eventStatus: apiFixture.event_status,
          eventQuarter: apiFixture.event_quarter,
          finalResult: apiFixture.event_final_result,
          eventLive: apiFixture.event_live,
          homeTeamKey: String(apiFixture.home_team_key),
          awayTeamKey: String(apiFixture.away_team_key),
          leagueKey: String(apiFixture.league_key),
          leagueRound: apiFixture.league_round,
          leagueSeason: apiFixture.league_season,
        },
      });

      if (apiFixture.scores) {
        await this.syncScores(fixture.id, apiFixture.scores);
      }

      if (apiFixture.statistics) {
        await this.syncStatistics(fixture.id, apiFixture.statistics);
      }

      if (apiFixture.lineups) {
        await this.syncLineups(fixture.id, apiFixture.lineups, apiFixture);
      }

      if (apiFixture.player_statistics) {
        await this.syncPlayerStatistics(
          fixture.id,
          apiFixture.player_statistics,
        );
      }

      syncedCount++;
    }

    return {
      synced: syncedCount,
      message: `Successfully synced ${syncedCount} fixtures`,
    };
  }

  private async syncScores(fixtureId: string, scores: any) {
    const quarters = [
      { quarter: '1st', data: scores['1stQuarter'] },
      { quarter: '2nd', data: scores['2ndQuarter'] },
      { quarter: '3rd', data: scores['3rdQuarter'] },
      { quarter: '4th', data: scores['4thQuarter'] },
    ];

    for (const { quarter, data } of quarters) {
      if (data && data.length > 0) {
        const score = data[0];
        await this.prisma.score.create({
          data: {
            fixtureId,
            quarter,
            scoreHome: String(score.score_home),
            scoreAway: String(score.score_away),
          },
        });
      }
    }
  }

  private async syncStatistics(fixtureId: string, statistics: any[]) {
    await this.prisma.fixtureStatistic.deleteMany({
      where: { fixtureId },
    });

    for (const stat of statistics) {
      await this.prisma.fixtureStatistic.create({
        data: {
          fixtureId,
          type: stat.type,
          home: String(stat.home),
          away: String(stat.away),
        },
      });
    }
  }

  private async syncLineups(fixtureId: string, lineups: any, apiFixture: any) {
    if (lineups.home_team) {
      await this.syncTeamLineup(
        fixtureId,
        String(apiFixture.home_team_key),
        'home',
        lineups.home_team,
      );
    }

    if (lineups.away_team) {
      await this.syncTeamLineup(
        fixtureId,
        String(apiFixture.away_team_key),
        'away',
        lineups.away_team,
      );
    }
  }

  private async syncTeamLineup(
    fixtureId: string,
    teamKey: string,
    teamType: string,
    teamLineup: any,
  ) {
    const allPlayers = [
      ...(teamLineup.starting_lineups || []),
      ...(teamLineup.substitutes || []),
    ];

    for (const apiPlayer of allPlayers) {
      const player = await this.prisma.player.upsert({
        where: { playerId: String(apiPlayer.player_id) },
        update: {
          name: apiPlayer.player,
          teamKey: teamKey,
        },
        create: {
          playerId: String(apiPlayer.player_id),
          name: apiPlayer.player,
          teamKey: teamKey,
        },
      });

      const isStarter = teamLineup.starting_lineups?.some(
        (p: any) => String(p.player_id) === String(apiPlayer.player_id),
      );

      const lineupData: any = {
        playerId: player.playerId,
        teamType,
        type: isStarter ? 'starter' : 'substitute',
        fixtureId: fixtureId,
      };
      if (teamType === 'away') {
        lineupData.awayFixtureId = fixtureId;
      }

      await this.prisma.lineup.create({
        data: lineupData,
      });
    }
  }

  private async syncPlayerStatistics(fixtureId: string, playerStats: any) {
    const homeStats = playerStats.home_team || [];
    const awayStats = playerStats.away_team || [];

    for (const stat of homeStats) {
      await this.createPlayerStatistic(fixtureId, stat, 'home');
    }

    for (const stat of awayStats) {
      await this.createPlayerStatistic(fixtureId, stat, 'away');
    }
  }

  private async createPlayerStatistic(
    fixtureId: string,
    stat: any,
    teamType: string,
  ) {
    const player = await this.prisma.player.findUnique({
      where: { playerId: String(stat.player_id) },
    });

    if (!player) {
      console.warn(`Player ${stat.player_id} not found, skipping stats`);
      return;
    }

    await this.prisma.playerStatistic.create({
      data: {
        fixtureId,
        playerId: player.playerId,
        teamType,
        assists: String(stat.player_assists || '0'),
        blocks: String(stat.player_blocks || '0'),
        defenseRebounds: String(stat.player_defense_rebounds || '0'),
        fieldGoalsAttempts: String(stat.player_field_goals_attempts || '0'),
        fieldGoalsMade: String(stat.player_field_goals_made || '0'),
        freethrowsAttempts: String(
          stat.player_freethrows_goals_attempts || '0',
        ),
        freethrowsMade: String(stat.player_freethrows_goals_made || '0'),
        minutes: String(stat.player_minutes || '0'),
        offenceRebounds: String(stat.player_offence_rebounds || '0'),
        onCourt: stat.player_oncourt || 'False',
        personalFouls: String(stat.player_personal_fouls || '0'),
        plusMinus: String(stat.player_plus_minus || '0'),
        position: stat.player_position || '',
        points: String(stat.player_points || '0'),
        steals: String(stat.player_steals || '0'),
        threepointAttempts: String(
          stat.player_threepoint_goals_attempts || '0',
        ),
        threepointMade: String(stat.player_threepoint_goals_made || '0'),
        totalRebounds: String(stat.player_total_rebounds || '0'),
        turnovers: String(stat.player_turnovers || '0'),
      },
    });
  }

  async findAll(
    filters?: {
      leagueKey?: string;
      teamKey?: string;
      date?: string;
    },
    pagination?: {
      page?: number;
      limit?: number;
    },
  ): Promise<PaginatedResult<any>> {
    const where: any = {};

    if (filters?.leagueKey) {
      where.leagueKey = filters.leagueKey;
    }

    if (filters?.teamKey) {
      where.OR = [
        { homeTeamKey: filters.teamKey },
        { awayTeamKey: filters.teamKey },
      ];
    }

    if (filters?.date) {
      where.eventDate = filters.date;
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.fixture.findMany({
        where,
        include: {
          homeTeam: true,
          awayTeam: true,
          league: {
            include: {
              country: true,
            },
          },
          scores: true,
          statistics: true,
        },
        orderBy: { eventDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.fixture.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByKey(eventKey: string) {
    return this.prisma.fixture.findUnique({
      where: { eventKey },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: {
          include: {
            country: true,
          },
        },
        scores: true,
        statistics: true,
        homeLineup: {
          include: {
            player: true,
          },
        },
        awayLineup: {
          include: {
            player: true,
          },
        },
        playerStatistics: {
          include: {
            player: true,
          },
        },
      },
    });
  }
}
