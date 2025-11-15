import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './country-response.dto';

export class TeamDto {
  @ApiProperty({ example: '1234', description: 'Identificador único do time' })
  teamKey: string;

  @ApiProperty({ example: 'Los Angeles Lakers', description: 'Nome do time' })
  name: string;

  @ApiProperty({ example: '766', description: 'Chave da liga' })
  leagueKey: string;

  @ApiProperty({
    example: 'https://example.com/lakers.png',
    description: 'URL do logo do time',
    nullable: true,
  })
  logo: string | null;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class TeamListResponseDto {
  @ApiProperty({ type: [TeamDto], description: 'Lista de times' })
  data: TeamDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
