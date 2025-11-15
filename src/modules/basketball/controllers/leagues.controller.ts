import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { LeaguesService } from '../services/leagues.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('leagues')
@UseInterceptors(CacheInterceptor)
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get()
  @CacheTTL(24 * 60 * 60 * 1000)
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

  @Roles(UserRole.ADMIN)
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncLeagues(@Query('countryId') countryId?: string) {
    return this.leaguesService.syncLeagues(countryId);
  }
}
