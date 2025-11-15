import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './country-response.dto';

export class LeagueDto {
  @ApiProperty({ example: '766', description: 'Identificador único da liga' })
  leagueKey: string;

  @ApiProperty({ example: 'NBA', description: 'Nome da liga' })
  name: string;

  @ApiProperty({ example: '1', description: 'Chave do país' })
  countryKey: string;

  @ApiProperty({
    example: 'https://example.com/nba.png',
    description: 'URL do logo da liga',
    nullable: true,
  })
  logo: string | null;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class LeagueListResponseDto {
  @ApiProperty({ type: [LeagueDto], description: 'Lista de ligas' })
  data: LeagueDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
