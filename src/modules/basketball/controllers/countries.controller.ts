import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CountriesService } from '../services/countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll() {
    return this.countriesService.getAllCountries();
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
