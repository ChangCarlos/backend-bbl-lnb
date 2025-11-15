import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FixturesQueryDto {
  @ApiProperty({
    example: '2025-01-10',
    description: 'Data inicial (formato: YYYY-MM-DD)',
  })
  @IsDateString()
  from: string;

  @ApiProperty({
    example: '2025-01-17',
    description: 'Data final (formato: YYYY-MM-DD)',
  })
  @IsDateString()
  to: string;

  @ApiProperty({
    example: 'America/New_York',
    description: 'Timezone',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({
    example: '1',
    description: 'ID do país',
    required: false,
  })
  @IsOptional()
  @IsString()
  countryId?: string;

  @ApiProperty({
    example: '766',
    description: 'ID da liga',
    required: false,
  })
  @IsOptional()
  @IsString()
  leagueId?: string;

  @ApiProperty({
    example: 'fixture123',
    description: 'ID da partida',
    required: false,
  })
  @IsOptional()
  @IsString()
  matchId?: string;

  @ApiProperty({
    example: '1234',
    description: 'ID do time',
    required: false,
  })
  @IsOptional()
  @IsString()
  teamId?: string;
}
