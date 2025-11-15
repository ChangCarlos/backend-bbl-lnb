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
import { CountriesService } from '../services/countries.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('countries')
@UseInterceptors(CacheInterceptor)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @CacheTTL(24 * 60 * 60 * 1000)
  async findAll(@Query() paginationDto?: PaginationDto) {
    return this.countriesService.getAllCountries(paginationDto);
  }

  @Get(':key')
  async findByKey(@Param('key') key: string) {
    return this.countriesService.findByKey(key);
  }

  @Roles(UserRole.ADMIN)
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncCountries() {
    return this.countriesService.syncCountries();
  }
}
