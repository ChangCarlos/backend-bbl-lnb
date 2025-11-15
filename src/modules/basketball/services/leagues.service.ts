import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { BasketballApiService } from './basketball-api.service';
import { PaginatedResult } from 'src/common/dto/pagination.dto';

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

  async findAll(pagination?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<any>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.league.findMany({
        include: {
          country: true,
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.league.count(),
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
