import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BasketballApiService } from './basketball-api.service';
import { PaginatedResult } from 'src/common/dto/pagination.dto';

@Injectable()
export class TeamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly basketballApi: BasketballApiService,
  ) {}

  async syncTeams(
    leagueId: string,
  ): Promise<{ synced: number; message: string }> {
    const teams = await this.basketballApi.getTeams(leagueId);

    let syncCount = 0;

    for (const apiTeam of teams) {
      await this.prisma.team.upsert({
        where: { teamKey: String(apiTeam.team_key) },
        update: {
          name: apiTeam.team_name,
          logo: apiTeam.team_logo,
        },
        create: {
          teamKey: String(apiTeam.team_key),
          name: apiTeam.team_name,
          logo: apiTeam.team_logo,
          league: {
            connect: { leagueKey: leagueId },
          },
        },
      });
      syncCount++;
    }

    return {
      synced: syncCount,
      message: `${syncCount} times sincronizados com sucesso.`,
    };
  }

  async findAll(pagination?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<any>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.team.findMany({
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.team.count(),
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

  async findByKey(teamKey: string) {
    return this.prisma.team.findUnique({
      where: { teamKey },
    });
  }

  async findByLeague(leagueKey: string) {
    const fixtures = await this.prisma.fixture.findMany({
      where: { leagueKey },
      select: {
        homeTeamKey: true,
        awayTeamKey: true,
      },
    });

    const teamKeys = new Set<string>();
    fixtures.forEach((fixture) => {
      teamKeys.add(fixture.homeTeamKey);
      teamKeys.add(fixture.awayTeamKey);
    });

    return this.prisma.team.findMany({
      where: {
        teamKey: {
          in: Array.from(teamKeys),
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}
