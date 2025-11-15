import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CountriesService } from '../services/countries.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll(@Query() paginationDto?: PaginationDto) {
    return this.countriesService.getAllCountries(paginationDto);
  }

  @Get(':key')
  async findByKey(@Param('key') key: string) {
    return this.countriesService.findByKey(key);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncCountries() {
    return this.countriesService.syncCountries();
  }
}
