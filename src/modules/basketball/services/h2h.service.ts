import { Injectable } from '@nestjs/common';
import { BasketballApiService } from './basketball-api.service';

@Injectable()
export class H2hService {
  constructor(private readonly basketballApiService: BasketballApiService) {}

  async getH2H(firstTeamId: string, secondTeamId: string) {
    const response = await this.basketballApiService.getH2H(
      firstTeamId,
      secondTeamId,
    );

    return {
      h2h: response.H2H,
      firstTeamResults: response.firstTeamResults,
      secondTeamResults: response.secondTeamResults,
    };
  }
}
