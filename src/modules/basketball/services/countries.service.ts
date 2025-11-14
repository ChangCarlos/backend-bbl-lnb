import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { BasketballApiService } from './basketball-api.service';

@Injectable()
export class CountriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly basketballApi: BasketballApiService,
  ) {}

  async syncCountries(): Promise<{ synced: number; message: string }> {
    const countries = await this.basketballApi.getCountries();

    let syncCount = 0;

    for (const country of countries) {
      await this.prisma.country.upsert({
        where: { countryKey: String(country.country_key) },
        update: {
          name: country.country_name,
        },
        create: {
          countryKey: String(country.country_key),
          name: country.country_name,
        },
      });
      syncCount++;
    }

    return {
      synced: syncCount,
      message: `Sincronização concluída. ${syncCount} países sincronizados.`,
    };
  }

  async getAllCountries() {
    return this.prisma.country.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findByKey(countryKey: string) {
    return this.prisma.country.findUnique({
      where: { countryKey },
    });
  }
}
