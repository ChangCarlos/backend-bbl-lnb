import { ApiProperty } from '@nestjs/swagger';

export class H2HMatchDto {
  @ApiProperty({ example: 'fixture123', description: 'Chave da partida' })
  fixtureKey: string;

  @ApiProperty({ example: '2025-01-10', description: 'Data da partida' })
  date: string;

  @ApiProperty({ example: '1234', description: 'Chave do time da casa' })
  homeTeamKey: string;

  @ApiProperty({ example: '1235', description: 'Chave do time visitante' })
  awayTeamKey: string;

  @ApiProperty({ example: 110, description: 'Placar do time da casa' })
  homeScore: number;

  @ApiProperty({ example: 105, description: 'Placar do time visitante' })
  awayScore: number;

  @ApiProperty({ example: '1234', description: 'Chave do time vencedor' })
  winner: string;
}

export class H2HResponseDto {
  @ApiProperty({ example: '1234', description: 'ID do primeiro time' })
  firstTeamId: string;

  @ApiProperty({ example: '1235', description: 'ID do segundo time' })
  secondTeamId: string;

  @ApiProperty({ example: 25, description: 'Total de jogos entre os times' })
  totalGames: number;

  @ApiProperty({
    example: 15,
    description: 'Vitórias do primeiro time',
  })
  firstTeamWins: number;

  @ApiProperty({
    example: 10,
    description: 'Vitórias do segundo time',
  })
  secondTeamWins: number;

  @ApiProperty({
    type: [H2HMatchDto],
    description: 'Últimos 5 confrontos',
  })
  lastFiveGames: H2HMatchDto[];
}
