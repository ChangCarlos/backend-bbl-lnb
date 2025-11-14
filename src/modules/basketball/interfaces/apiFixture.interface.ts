export interface ApiQuarterScore {
  score_home: string;
  score_away: string;
}

export interface ApiScores {
  '1stQuarter': ApiQuarterScore[];
  '2ndQuarter': ApiQuarterScore[];
  '3rdQuarter': ApiQuarterScore[];
  '4thQuarter': ApiQuarterScore[];
}

export interface ApiStatistic {
  type: string;
  home: string;
  away: string;
}

export interface ApiLineupPlayer {
  player: string;
  player_id: string | number;
}

export interface ApiTeamLineup {
  starting_lineups: ApiLineupPlayer[];
  substitutes: ApiLineupPlayer[];
}

export interface ApiLineups {
  home_team: ApiTeamLineup;
  away_team: ApiTeamLineup;
}

export interface ApiPlayerStatistic {
  player: string;
  player_id: string | number;
  player_assists: string;
  player_blocks: string;
  player_defense_rebounds: string;
  player_field_goals_attempts: string;
  player_field_goals_made: string;
  player_freethrows_goals_attempts: string;
  player_freethrows_goals_made: string;
  player_minutes: string;
  player_offence_rebounds: string;
  player_oncourt: string;
  player_personal_fouls: string;
  player_plus_minus: string;
  player_position: string;
  player_points: string;
  player_steals: string;
  player_threepoint_goals_attempts: string;
  player_threepoint_goals_made: string;
  player_total_rebounds: string;
  player_turnovers: string;
}

export interface ApiPlayerStatistics {
  home_team: ApiPlayerStatistic[];
  away_team: ApiPlayerStatistic[];
}

export interface ApiFixture {
  event_key: string | number;
  event_date: string;
  event_time: string;
  event_home_team: string;
  home_team_key: string | number;
  event_away_team: string;
  away_team_key: string | number;
  event_final_result: string;
  event_quarter: string | null;
  event_status: string;
  country_name: string;
  league_name: string;
  league_key: string | number;
  league_round: string | null;
  league_season: string;
  event_live: string;
  event_home_team_logo: string | null;
  event_away_team_logo: string | null;
  scores?: ApiScores;
  statistics?: ApiStatistic[];
  lineups?: ApiLineups;
  player_statistics?: ApiPlayerStatistics;
}

export interface ApiH2HResponse {
  H2H: ApiFixture[];
  firstTeamResults: ApiFixture[];
  secondTeamResults: ApiFixture[];
}
