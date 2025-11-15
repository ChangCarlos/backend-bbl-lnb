import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BasketballApiService } from './basketball-api.service';

@Injectable()
export class StandingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly basketballApi: BasketballApiService,
  ) {}

  async syncStandings(
    leagueId: string,
  ): Promise<{ synced: number; message: string }> {
    const response = await this.basketballApi.getStandings(leagueId);

    const standings = response.total;
    let syncCount = 0;

    for (const standing of standings) {
      const league = await this.prisma.league.findUnique({
        where: { leagueKey: String(standing.league_key) },
      });

      if (!league) {
        console.warn(
          `League ${standing.league_key} not found, skipping standing`,
        );
        continue;
      }

      const team = await this.prisma.team.findUnique({
        where: { teamKey: String(standing.team_key) },
      });

      if (!team) {
        console.warn(`Team ${standing.team_key} not found, skipping standing`);
        continue;
      }

      await this.prisma.standing.upsert({
        where: {
          teamKey_leagueKey_leagueSeason_leagueRound: {
            teamKey: String(standing.team_key),
            leagueKey: String(standing.league_key),
            leagueSeason: standing.league_season,
            leagueRound: standing.league_round || '',
          },
        },
        update: {
          standingPlace: String(standing.standing_place),
          standingPlaceType: standing.standing_place_type || null,
          standingTeam: standing.standing_team,
          standingP: String(standing.standing_P),
          standingW: String(standing.standing_W),
          standingWO: String(standing.standing_WO),
          standingL: String(standing.standing_L),
          standingLO: String(standing.standing_LO),
          standingF: String(standing.standing_F),
          standingA: String(standing.standing_A),
          standingPCT: standing.standing_PCT || null,
          standingUpdated: standing.standing_updated || null,
        },
        create: {
          teamKey: String(standing.team_key),
          leagueKey: String(standing.league_key),
          leagueSeason: standing.league_season,
          leagueRound: standing.league_round || '',
          standingPlace: String(standing.standing_place),
          standingPlaceType: standing.standing_place_type || null,
          standingTeam: standing.standing_team,
          standingP: String(standing.standing_P),
          standingW: String(standing.standing_W),
          standingWO: String(standing.standing_WO),
          standingL: String(standing.standing_L),
          standingLO: String(standing.standing_LO),
          standingF: String(standing.standing_F),
          standingA: String(standing.standing_A),
          standingPCT: standing.standing_PCT || null,
          standingUpdated: standing.standing_updated || null,
        },
      });
      syncCount++;
    }

    return {
      synced: syncCount,
      message: `Successfully synced ${syncCount} standings`,
    };
  }

  async findByLeague(leagueKey: string) {
    return this.prisma.standing.findMany({
      where: { leagueKey },
      include: {
        team: true,
        league: {
          include: {
            country: true,
          },
        },
      },
      orderBy: { standingPlace: 'asc' },
    });
  }

  async findByLeagueAndSeason(leagueKey: string, season: string) {
    return this.prisma.standing.findMany({
      where: {
        leagueKey,
        leagueSeason: season,
      },
      include: {
        team: true,
        league: {
          include: {
            country: true,
          },
        },
      },
      orderBy: { standingPlace: 'asc' },
    });
  }
}
