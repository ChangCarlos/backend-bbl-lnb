export interface ApiStanding {
    standing_place: string;
    standing_place_type: string;
    standing_team: string;
    standing_P: string;
    standing_W: string;
    standing_WO: string;
    standing_L: string;
    standing_LO: string;
    standing_F: string;
    standing_A: string;
    standing_PCT: string;
    team_key: string;
    league_key: string;
    league_season: string;
    league_round: string;
    standing_updated: string;
}

export interface ApiStandingsResponse {
    total: ApiStanding[];
}