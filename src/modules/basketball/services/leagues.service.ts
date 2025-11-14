import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { BasketballApiService } from './basketball-api.service';

@Injectable()
export class LeaguesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly basketballApi: BasketballApiService,
  ) {}

  async syncLeagues(
    countryId?: string,
  ): Promise<{ synced: number; message: string }> {
    const leagues = await this.basketballApi.getLeagues(countryId);

    let syncCount = 0;

    for (const league of leagues) {
      const country = await this.prisma.country.findUnique({
        where: { countryKey: String(league.country_key) },
      });

      if (!country) {
        continue;
      }

      await this.prisma.league.upsert({
        where: { leagueKey: String(league.league_key) },
        update: {
          name: league.league_name,
          countryKey: country.countryKey,
        },
        create: {
          leagueKey: String(league.league_key),
          name: league.league_name,
          countryKey: country.countryKey,
        },
      });
      syncCount++;
    }
    return {
      synced: syncCount,
      message: `${syncCount} campeonatos sincronizados.`,
    };
  }

  async findAll() {
    return this.prisma.league.findMany({
      include: {
        country: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByKey(leagueKey: string) {
    return this.prisma.league.findUnique({
      where: { leagueKey },
      include: {
        country: true,
      },
    });
  }

  async findByCountry(countryKey: string) {
    const country = await this.prisma.country.findUnique({
      where: { countryKey },
    });

    if (!country) {
      return [];
    }

    return this.prisma.league.findMany({
      where: { countryKey: country.countryKey },
      include: {
        country: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
