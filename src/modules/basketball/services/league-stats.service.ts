import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface LeagueStats {
  totalTeams: number;
  totalGames: number;
  currentSeason: string;
}

@Injectable()
export class LeagueStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeagueStats(leagueKey: string): Promise<LeagueStats> {
    const fixtures = await this.prisma.fixture.findMany({
      where: { leagueKey },
      select: {
        homeTeamKey: true,
        awayTeamKey: true,
        leagueSeason: true,
      },
    });

    const teamKeys = new Set<string>();
    let currentSeason = '';

    fixtures.forEach((fixture) => {
      teamKeys.add(fixture.homeTeamKey);
      teamKeys.add(fixture.awayTeamKey);
      if (fixture.leagueSeason && fixture.leagueSeason > currentSeason) {
        currentSeason = fixture.leagueSeason;
      }
    });

    const totalGames = await this.prisma.fixture.count({
      where: {
        leagueKey,
        leagueSeason: currentSeason || undefined,
      },
    });

    return {
      totalTeams: teamKeys.size,
      totalGames,
      currentSeason: currentSeason || '2024/25',
    };
  }
}
