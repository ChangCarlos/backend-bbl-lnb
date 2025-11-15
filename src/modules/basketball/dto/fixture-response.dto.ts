import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './country-response.dto';

export class ScoreDto {
  @ApiProperty({ example: 'final', description: 'Tipo do placar' })
  scoreType: string;

  @ApiProperty({ example: 110, description: 'Placar do time da casa' })
  homeScore: number;

  @ApiProperty({ example: 105, description: 'Placar do time visitante' })
  awayScore: number;
}

export class StatisticDto {
  @ApiProperty({
    example: 'field_goals',
    description: 'Tipo da estatística',
  })
  statisticType: string;

  @ApiProperty({ example: '45/90', description: 'Valor do time da casa' })
  homeValue: string;

  @ApiProperty({ example: '42/88', description: 'Valor do time visitante' })
  awayValue: string;
}

export class LineupDto {
  @ApiProperty({ example: 'player123', description: 'Chave do jogador' })
  playerKey: string;

  @ApiProperty({ example: 'LeBron James', description: 'Nome do jogador' })
  playerName: string;

  @ApiProperty({ example: 'SF', description: 'Posição do jogador' })
  position: string;
}

export class PlayerStatisticDto {
  @ApiProperty({ example: 'player123', description: 'Chave do jogador' })
  playerKey: string;

  @ApiProperty({ example: 'LeBron James', description: 'Nome do jogador' })
  playerName: string;

  @ApiProperty({ example: 28, description: 'Pontos marcados' })
  points: number;

  @ApiProperty({ example: 10, description: 'Rebotes' })
  rebounds: number;

  @ApiProperty({ example: 8, description: 'Assistências' })
  assists: number;
}

export class FixtureDto {
  @ApiProperty({
    example: 'fixture123',
    description: 'Identificador único da partida',
  })
  fixtureKey: string;

  @ApiProperty({ example: '2025-01-20', description: 'Data da partida' })
  date: string;

  @ApiProperty({ example: '19:00', description: 'Horário da partida' })
  time: string;

  @ApiProperty({ example: '766', description: 'Chave da liga' })
  leagueKey: string;

  @ApiProperty({ example: '1234', description: 'Chave do time da casa' })
  homeTeamKey: string;

  @ApiProperty({ example: '1235', description: 'Chave do time visitante' })
  awayTeamKey: string;

  @ApiProperty({
    example: 'Finished',
    description: 'Status da partida',
    nullable: true,
  })
  status: string | null;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class FixtureDetailDto extends FixtureDto {
  @ApiProperty({
    type: [ScoreDto],
    description: 'Placares da partida',
    required: false,
  })
  scores?: ScoreDto[];

  @ApiProperty({
    type: [StatisticDto],
    description: 'Estatísticas da partida',
    required: false,
  })
  statistics?: StatisticDto[];

  @ApiProperty({
    type: [LineupDto],
    description: 'Escalações da partida',
    required: false,
  })
  lineups?: LineupDto[];

  @ApiProperty({
    type: [PlayerStatisticDto],
    description: 'Estatísticas dos jogadores',
    required: false,
  })
  playerStatistics?: PlayerStatisticDto[];
}

export class FixtureListResponseDto {
  @ApiProperty({ type: [FixtureDto], description: 'Lista de partidas' })
  data: FixtureDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
