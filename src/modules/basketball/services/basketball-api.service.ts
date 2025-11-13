import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import {
  ApiCountry,
  ApiFixture,
  ApiH2HResponse,
  ApiLeague,
  ApiResponse,
  ApiStandingsResponse,
  ApiTeam,
} from '../interfaces';
import { firstValueFrom } from 'rxjs';
import { FixturesQueryDto } from '../dto/fixturesQuery.dto';
import { LivescoreQueryDto } from '../dto/livescoreQuery.dto';

@Injectable()
export class BasketballApiService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('basketballApi.apiUrl')!;
    this.apiKey = this.configService.get<string>('basketballApi.apiKey')!;

    if (!this.apiUrl || !this.apiKey) {
      throw new Error('Basketball API configuration is missing');
    }
  }

  private buildUrl(
    method: string,
    params: Record<string, string | undefined> = {},
  ): string {
    const url = new URL(this.apiUrl);
    url.searchParams.append('met', method);
    url.searchParams.append('APIkey', this.apiKey);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    return url.toString();
  }

  private async request<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<T>>(url),
      );

      if (response.data.success !== 1) {
        throw new HttpException(
          'API returned error response',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to fetch data from Basketball API: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCountries(): Promise<ApiCountry[]> {
    const url = this.buildUrl('Countries');
    const response = await this.request<ApiCountry[]>(url);
    return response.result;
  }

  async getLeagues(countryId?: string): Promise<ApiLeague[]> {
    const url = this.buildUrl('Leagues', { countryId });
    const response = await this.request<ApiLeague[]>(url);
    return response.result;
  }

  async getTeams(leagueId: string): Promise<ApiTeam[]> {
    const url = this.buildUrl('Teams', { leagueId });
    const response = await this.request<ApiTeam[]>(url);
    return response.result;
  }

  async getFixtures(params: FixturesQueryDto): Promise<ApiFixture[]> {
    const url = this.buildUrl('Fixtures', {
      from: params.from,
      to: params.to,
      timezone: params.timezone,
      countryId: params.countryId,
      leagueId: params.leagueId,
      matchId: params.matchId,
      teamId: params.teamId,
    });
    const response = await this.request<ApiFixture[]>(url);
    return response.result;
  }

  async getLivescore(params?: LivescoreQueryDto): Promise<ApiFixture[]> {
    const url = this.buildUrl('Livescore', {
      timezone: params?.timezone,
      countryId: params?.countryId,
      leagueId: params?.leagueId,
      matchId: params?.matchId,
    });
    const response = await this.request<ApiFixture[]>(url);
    return response.result;
  }

  async getStandings(leagueId: string): Promise<ApiStandingsResponse> {
    const url = this.buildUrl('Standings', { leagueId });
    const response = await this.request<ApiStandingsResponse>(url);
    return response.result;
  }

  async getH2H(
    firstTeamId: string,
    secondTeamId: string,
  ): Promise<ApiH2HResponse> {
    const url = this.buildUrl('H2H', { firstTeamId, secondTeamId });
    const response = await this.request<ApiH2HResponse>(url);
    return response.result;
  }
}
