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
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Public()
  @Get()
  async findAll(@Query() paginationDto?: PaginationDto) {
    return this.leaguesService.findAll(paginationDto);
  }

  @Get('country/:countryKey')
  async findByCountry(@Param('countryKey') countryKey: string) {
    return this.leaguesService.findByCountry(countryKey);
  }

  @Get(':key')
  async findByKey(@Param('key') key: string) {
    return this.leaguesService.findByKey(key);
  }

  @Public()
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncLeagues(@Query('countryId') countryId?: string) {
    return this.leaguesService.syncLeagues(countryId);
  }
}
