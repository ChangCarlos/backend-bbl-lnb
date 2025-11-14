import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { LeaguesService } from '../services/leagues.service';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get()
  async findAll() {
    return this.leaguesService.findAll();
  }

  @Get('country/:countryKey')
  async findByCountry(@Param('countryKey') countryKey: string) {
    return this.leaguesService.findByCountry(countryKey);
  }

  @Get(':key')
  async findByKey(@Param('key') key: string) {
    return this.leaguesService.findByKey(key);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncLeagues(@Query('countryId') countryId?: string) {
    return this.leaguesService.syncLeagues(countryId);
  }
}
