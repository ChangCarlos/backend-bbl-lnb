import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FixtureFiltersDto extends PaginationDto {
  @ApiProperty({
    example: '757',
    description: 'Filtrar fixtures por liga',
    required: false,
  })
  @IsOptional()
  @IsString()
  leagueKey?: string;

  @ApiProperty({
    example: '81',
    description: 'Filtrar fixtures por time (home ou away)',
    required: false,
  })
  @IsOptional()
  @IsString()
  teamKey?: string;

  @ApiProperty({
    example: '2025-01-20',
    description: 'Filtrar fixtures por data específica (formato: YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsString()
  date?: string;
}
