import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BasketballApiService } from './services/basketball-api.service';
import { CountriesService } from './services/countries.service';
import { LeaguesService } from './services/leagues.service';
import { TeamsService } from './services/teams.service';
import { FixturesService } from './services/fixtures.service';
import { StandingsService } from './services/standings.service';
import { H2hService } from './services/h2h.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CountriesController } from './controllers/countries.controller';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [CountriesController],
  providers: [
    BasketballApiService,
    CountriesService,
    LeaguesService,
    TeamsService,
    FixturesService,
    StandingsService,
    H2hService,
  ],
  exports: [
    BasketballApiService,
    CountriesService,
    LeaguesService,
    TeamsService,
    FixturesService,
    StandingsService,
    H2hService,
  ],
})
export class BasketballModule {}
