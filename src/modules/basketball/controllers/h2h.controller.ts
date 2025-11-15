import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { H2hService } from '../services/h2h.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('h2h')
export class H2hController {
  constructor(private readonly h2hService: H2hService) {}

  @Public()
  @Get(':firstTeamId/:secondTeamId')
  async getH2H(
    @Param('firstTeamId') firstTeamId: string,
    @Param('secondTeamId') secondTeamId: string,
  ) {
    if (!firstTeamId || !secondTeamId) {
      throw new BadRequestException('Both team IDs must be provided');
    }

    return this.h2hService.getH2H(firstTeamId, secondTeamId);
  }
}
