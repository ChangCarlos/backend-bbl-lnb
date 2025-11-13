import { IsOptional, IsString } from 'class-validator';

export class LivescoreQueryDto {
  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  countryId?: string;

  @IsOptional()
  @IsString()
  leagueId?: string;

  @IsOptional()
  @IsString()
  matchId?: string;
}
