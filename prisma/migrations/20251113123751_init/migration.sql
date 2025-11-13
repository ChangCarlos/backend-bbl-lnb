-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "country_key" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixture_statistics" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "home" TEXT NOT NULL,
    "away" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fixture_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixtures" (
    "id" TEXT NOT NULL,
    "event_key" TEXT NOT NULL,
    "event_date" TEXT NOT NULL,
    "event_time" TEXT NOT NULL,
    "event_status" TEXT NOT NULL,
    "event_quarter" TEXT,
    "event_live" TEXT NOT NULL DEFAULT '0',
    "event_final_result" TEXT,
    "home_team_key" TEXT NOT NULL,
    "away_team_key" TEXT NOT NULL,
    "league_key" TEXT NOT NULL,
    "league_round" TEXT,
    "league_season" TEXT,
    "home_team_logo" TEXT,
    "away_team_logo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixtures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "head_to_head" (
    "id" TEXT NOT NULL,
    "first_team_key" TEXT NOT NULL,
    "second_team_key" TEXT NOT NULL,
    "event_key" TEXT NOT NULL,
    "event_date" TEXT NOT NULL,
    "event_time" TEXT NOT NULL,
    "event_home_team" TEXT NOT NULL,
    "home_team_key" TEXT NOT NULL,
    "event_away_team" TEXT NOT NULL,
    "away_team_key" TEXT NOT NULL,
    "event_final_result" TEXT,
    "event_status" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "league_name" TEXT NOT NULL,
    "league_key" TEXT NOT NULL,
    "league_round" TEXT,
    "league_season" TEXT NOT NULL,
    "event_live" TEXT NOT NULL DEFAULT '0',
    "recordType" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "head_to_head_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leagues" (
    "id" TEXT NOT NULL,
    "league_key" TEXT NOT NULL,
    "league_name" TEXT NOT NULL,
    "country_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lineups" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "awayFixtureId" TEXT,
    "playerId" TEXT NOT NULL,
    "teamType" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lineups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_statistics" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "teamType" TEXT NOT NULL,
    "player_assists" TEXT,
    "player_blocks" TEXT,
    "player_defense_rebounds" TEXT,
    "player_field_goals_attempts" TEXT,
    "player_field_goals_made" TEXT,
    "player_freethrows_goals_attempts" TEXT,
    "player_freethrows_goals_made" TEXT,
    "player_minutes" TEXT,
    "player_offence_rebounds" TEXT,
    "player_oncourt" TEXT,
    "player_personal_fouls" TEXT,
    "player_plus_minus" TEXT,
    "player_position" TEXT,
    "player_points" TEXT,
    "player_steals" TEXT,
    "player_threepoint_goals_attempts" TEXT,
    "player_threepoint_goals_made" TEXT,
    "player_total_rebounds" TEXT,
    "player_turnovers" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "player_name" TEXT NOT NULL,
    "team_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "score_home" TEXT NOT NULL,
    "score_away" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standings" (
    "id" TEXT NOT NULL,
    "standing_place" TEXT NOT NULL,
    "standing_place_type" TEXT,
    "standing_team" TEXT NOT NULL,
    "standing_p" TEXT NOT NULL,
    "standing_w" TEXT NOT NULL,
    "standing_wo" TEXT NOT NULL,
    "standing_l" TEXT NOT NULL,
    "standing_lo" TEXT NOT NULL,
    "standing_f" TEXT NOT NULL,
    "standing_a" TEXT NOT NULL,
    "standing_pct" TEXT,
    "team_key" TEXT NOT NULL,
    "league_key" TEXT NOT NULL,
    "league_season" TEXT NOT NULL,
    "league_round" TEXT,
    "standing_updated" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "standings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "team_key" TEXT NOT NULL,
    "team_name" TEXT NOT NULL,
    "team_logo" TEXT,
    "league_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_country_key_key" ON "countries"("country_key");

-- CreateIndex
CREATE INDEX "countries_country_key_idx" ON "countries"("country_key");

-- CreateIndex
CREATE INDEX "fixture_statistics_fixtureId_idx" ON "fixture_statistics"("fixtureId");

-- CreateIndex
CREATE UNIQUE INDEX "fixtures_event_key_key" ON "fixtures"("event_key");

-- CreateIndex
CREATE INDEX "fixtures_event_key_idx" ON "fixtures"("event_key");

-- CreateIndex
CREATE INDEX "fixtures_home_team_key_idx" ON "fixtures"("home_team_key");

-- CreateIndex
CREATE INDEX "fixtures_away_team_key_idx" ON "fixtures"("away_team_key");

-- CreateIndex
CREATE INDEX "fixtures_league_key_idx" ON "fixtures"("league_key");

-- CreateIndex
CREATE INDEX "fixtures_event_date_idx" ON "fixtures"("event_date");

-- CreateIndex
CREATE INDEX "fixtures_event_status_idx" ON "fixtures"("event_status");

-- CreateIndex
CREATE INDEX "head_to_head_first_team_key_idx" ON "head_to_head"("first_team_key");

-- CreateIndex
CREATE INDEX "head_to_head_second_team_key_idx" ON "head_to_head"("second_team_key");

-- CreateIndex
CREATE INDEX "head_to_head_event_key_idx" ON "head_to_head"("event_key");

-- CreateIndex
CREATE INDEX "head_to_head_recordType_idx" ON "head_to_head"("recordType");

-- CreateIndex
CREATE UNIQUE INDEX "head_to_head_event_key_first_team_key_second_team_key_recor_key" ON "head_to_head"("event_key", "first_team_key", "second_team_key", "recordType");

-- CreateIndex
CREATE UNIQUE INDEX "leagues_league_key_key" ON "leagues"("league_key");

-- CreateIndex
CREATE INDEX "leagues_country_key_idx" ON "leagues"("country_key");

-- CreateIndex
CREATE INDEX "leagues_league_key_idx" ON "leagues"("league_key");

-- CreateIndex
CREATE INDEX "lineups_fixtureId_idx" ON "lineups"("fixtureId");

-- CreateIndex
CREATE INDEX "lineups_playerId_idx" ON "lineups"("playerId");

-- CreateIndex
CREATE INDEX "player_statistics_fixtureId_idx" ON "player_statistics"("fixtureId");

-- CreateIndex
CREATE INDEX "player_statistics_playerId_idx" ON "player_statistics"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "players_player_id_key" ON "players"("player_id");

-- CreateIndex
CREATE INDEX "players_player_id_idx" ON "players"("player_id");

-- CreateIndex
CREATE INDEX "players_team_key_idx" ON "players"("team_key");

-- CreateIndex
CREATE INDEX "scores_fixtureId_idx" ON "scores"("fixtureId");

-- CreateIndex
CREATE INDEX "standings_team_key_idx" ON "standings"("team_key");

-- CreateIndex
CREATE INDEX "standings_league_key_idx" ON "standings"("league_key");

-- CreateIndex
CREATE INDEX "standings_league_season_idx" ON "standings"("league_season");

-- CreateIndex
CREATE UNIQUE INDEX "standings_team_key_league_key_league_season_league_round_key" ON "standings"("team_key", "league_key", "league_season", "league_round");

-- CreateIndex
CREATE UNIQUE INDEX "teams_team_key_key" ON "teams"("team_key");

-- CreateIndex
CREATE INDEX "teams_team_key_idx" ON "teams"("team_key");

-- CreateIndex
CREATE INDEX "teams_league_key_idx" ON "teams"("league_key");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "fixture_statistics" ADD CONSTRAINT "fixture_statistics_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "fixtures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixtures" ADD CONSTRAINT "fixtures_home_team_key_fkey" FOREIGN KEY ("home_team_key") REFERENCES "teams"("team_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixtures" ADD CONSTRAINT "fixtures_away_team_key_fkey" FOREIGN KEY ("away_team_key") REFERENCES "teams"("team_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixtures" ADD CONSTRAINT "fixtures_league_key_fkey" FOREIGN KEY ("league_key") REFERENCES "leagues"("league_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "head_to_head" ADD CONSTRAINT "head_to_head_first_team_key_fkey" FOREIGN KEY ("first_team_key") REFERENCES "teams"("team_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "head_to_head" ADD CONSTRAINT "head_to_head_second_team_key_fkey" FOREIGN KEY ("second_team_key") REFERENCES "teams"("team_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_country_key_fkey" FOREIGN KEY ("country_key") REFERENCES "countries"("country_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineups" ADD CONSTRAINT "lineups_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "fixtures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineups" ADD CONSTRAINT "lineups_awayFixtureId_fkey" FOREIGN KEY ("awayFixtureId") REFERENCES "fixtures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineups" ADD CONSTRAINT "lineups_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_statistics" ADD CONSTRAINT "player_statistics_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "fixtures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_statistics" ADD CONSTRAINT "player_statistics_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_key_fkey" FOREIGN KEY ("team_key") REFERENCES "teams"("team_key") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "fixtures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standings" ADD CONSTRAINT "standings_team_key_fkey" FOREIGN KEY ("team_key") REFERENCES "teams"("team_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standings" ADD CONSTRAINT "standings_league_key_fkey" FOREIGN KEY ("league_key") REFERENCES "leagues"("league_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_league_key_fkey" FOREIGN KEY ("league_key") REFERENCES "leagues"("league_key") ON DELETE CASCADE ON UPDATE CASCADE;
