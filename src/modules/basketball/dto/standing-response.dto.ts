import { ApiProperty } from '@nestjs/swagger';

export class StandingDto {
  @ApiProperty({ example: '766', description: 'Chave da liga' })
  leagueKey: string;

  @ApiProperty({ example: '2024-2025', description: 'Temporada' })
  season: string;

  @ApiProperty({ example: '1234', description: 'Chave do time' })
  teamKey: string;

  @ApiProperty({ example: 'Los Angeles Lakers', description: 'Nome do time' })
  teamName: string;

  @ApiProperty({ example: 1, description: 'Posição na tabela' })
  position: number;

  @ApiProperty({ example: 50, description: 'Jogos disputados' })
  played: number;

  @ApiProperty({ example: 35, description: 'Vitórias' })
  won: number;

  @ApiProperty({ example: 15, description: 'Derrotas' })
  lost: number;

  @ApiProperty({
    example: 0.7,
    description: 'Percentual de vitórias',
    nullable: true,
  })
  winPercentage: number | null;

  @ApiProperty({
    example: 'W3',
    description: 'Sequência atual',
    nullable: true,
  })
  streak: string | null;

  @ApiProperty({
    example: 'Western',
    description: 'Conferência',
    nullable: true,
  })
  conference: string | null;

  @ApiProperty({
    example: 'Pacific',
    description: 'Divisão',
    nullable: true,
  })
  division: string | null;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  updatedAt: Date;
}
