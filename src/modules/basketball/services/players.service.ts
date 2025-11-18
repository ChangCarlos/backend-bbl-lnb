import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlayersByTeam(teamKey: string) {
    const players = await this.prisma.player.findMany({
      where: { teamKey },
      include: {
        statistics: true,
      },
      orderBy: { name: 'asc' },
    });

    return players.map((player) => {
      const stats = player.statistics;
      const gamesPlayed = stats.length;

      if (gamesPlayed === 0) {
        return {
          playerId: player.playerId,
          name: player.name,
          teamKey: player.teamKey,
          gamesPlayed: 0,
          avgPoints: 0,
          avgRebounds: 0,
          avgAssists: 0,
          avgSteals: 0,
          avgBlocks: 0,
          avgMinutes: 0,
          fgPercentage: 0,
          threePointPercentage: 0,
          ftPercentage: 0,
        };
      }

      const totalPoints = stats.reduce(
        (sum, s) => sum + (parseFloat(s.points || '0') || 0),
        0,
      );
      const totalRebounds = stats.reduce(
        (sum, s) => sum + (parseFloat(s.totalRebounds || '0') || 0),
        0,
      );
      const totalAssists = stats.reduce(
        (sum, s) => sum + (parseFloat(s.assists || '0') || 0),
        0,
      );
      const totalSteals = stats.reduce(
        (sum, s) => sum + (parseFloat(s.steals || '0') || 0),
        0,
      );
      const totalBlocks = stats.reduce(
        (sum, s) => sum + (parseFloat(s.blocks || '0') || 0),
        0,
      );
      const totalMinutes = stats.reduce((sum, s) => {
        const minutes = s.minutes || '0';
        return sum + (parseFloat(minutes) || 0);
      }, 0);

      const fgMade = stats.reduce(
        (sum, s) => sum + (parseFloat(s.fieldGoalsMade || '0') || 0),
        0,
      );
      const fgAttempts = stats.reduce(
        (sum, s) => sum + (parseFloat(s.fieldGoalsAttempts || '0') || 0),
        0,
      );

      const tpMade = stats.reduce(
        (sum, s) => sum + (parseFloat(s.threepointMade || '0') || 0),
        0,
      );
      const tpAttempts = stats.reduce(
        (sum, s) => sum + (parseFloat(s.threepointAttempts || '0') || 0),
        0,
      );

      const ftMade = stats.reduce(
        (sum, s) => sum + (parseFloat(s.freethrowsMade || '0') || 0),
        0,
      );
      const ftAttempts = stats.reduce(
        (sum, s) => sum + (parseFloat(s.freethrowsAttempts || '0') || 0),
        0,
      );

      return {
        playerId: player.playerId,
        name: player.name,
        teamKey: player.teamKey,
        gamesPlayed,
        avgPoints: gamesPlayed > 0 ? totalPoints / gamesPlayed : 0,
        avgRebounds: gamesPlayed > 0 ? totalRebounds / gamesPlayed : 0,
        avgAssists: gamesPlayed > 0 ? totalAssists / gamesPlayed : 0,
        avgSteals: gamesPlayed > 0 ? totalSteals / gamesPlayed : 0,
        avgBlocks: gamesPlayed > 0 ? totalBlocks / gamesPlayed : 0,
        avgMinutes: gamesPlayed > 0 ? totalMinutes / gamesPlayed : 0,
        fgPercentage: fgAttempts > 0 ? (fgMade / fgAttempts) * 100 : 0,
        threePointPercentage: tpAttempts > 0 ? (tpMade / tpAttempts) * 100 : 0,
        ftPercentage: ftAttempts > 0 ? (ftMade / ftAttempts) * 100 : 0,
      };
    });
  }

  async getFixturePlayerStats(fixtureId: string) {
    const fixture = await this.prisma.fixture.findUnique({
      where: { id: fixtureId },
      include: {
        playerStatistics: {
          include: {
            player: true,
          },
          orderBy: { points: 'desc' },
        },
        scores: {
          orderBy: { quarter: 'asc' },
        },
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!fixture) {
      return null;
    }

    const uniqueStats = fixture.playerStatistics.reduce((acc, stat) => {
      const key = `${stat.playerId}-${stat.teamType}`;
      const existing = acc.get(key);

      if (!existing || (stat.points || 0) > (existing.points || 0)) {
        acc.set(key, stat);
      }
      return acc;
    }, new Map());

    const uniqueStatsArray = Array.from(uniqueStats.values());

    const uniqueScores = fixture.scores.reduce((acc, score) => {
      acc.set(score.quarter, score);
      return acc;
    }, new Map());

    const uniqueScoresArray = Array.from(uniqueScores.values()).sort((a, b) => {
      const parseQuarter = (q: string) => {
        if (q.includes('1st')) return 1;
        if (q.includes('2nd')) return 2;
        if (q.includes('3rd')) return 3;
        if (q.includes('4th')) return 4;
        if (q.includes('OT')) return 5;
        return 0;
      };
      return parseQuarter(a.quarter) - parseQuarter(b.quarter);
    });

    const homeStats = uniqueStatsArray
      .filter((stat) => stat.teamType === 'home')
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .map((stat) => ({
        playerId: stat.playerId,
        playerName: stat.player.name,
        minutes: stat.minutes,
        points: stat.points,
        totalRebounds: stat.totalRebounds,
        assists: stat.assists,
        steals: stat.steals,
        blocks: stat.blocks,
        fieldGoalsMade: stat.fieldGoalsMade,
        fieldGoalsAttempts: stat.fieldGoalsAttempts,
        threepointMade: stat.threepointMade,
        threepointAttempts: stat.threepointAttempts,
        freethrowsMade: stat.freethrowsMade,
        freethrowsAttempts: stat.freethrowsAttempts,
        personalFouls: stat.personalFouls,
        turnovers: stat.turnovers,
        position: stat.position,
      }));

    const awayStats = uniqueStatsArray
      .filter((stat) => stat.teamType === 'away')
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .map((stat) => ({
        playerId: stat.playerId,
        playerName: stat.player.name,
        minutes: stat.minutes,
        points: stat.points,
        totalRebounds: stat.totalRebounds,
        assists: stat.assists,
        steals: stat.steals,
        blocks: stat.blocks,
        fieldGoalsMade: stat.fieldGoalsMade,
        fieldGoalsAttempts: stat.fieldGoalsAttempts,
        threepointMade: stat.threepointMade,
        threepointAttempts: stat.threepointAttempts,
        freethrowsMade: stat.freethrowsMade,
        freethrowsAttempts: stat.freethrowsAttempts,
        personalFouls: stat.personalFouls,
        turnovers: stat.turnovers,
        position: stat.position,
      }));

    return {
      fixture: {
        id: fixture.id,
        eventKey: fixture.eventKey,
        eventDate: fixture.eventDate,
        eventTime: fixture.eventTime,
        eventStatus: fixture.eventStatus,
        finalResult: fixture.finalResult,
      },
      scores: uniqueScoresArray.map((score) => ({
        quarter: score.quarter,
        scoreHome: score.scoreHome,
        scoreAway: score.scoreAway,
      })),
      homeTeam: {
        teamKey: fixture.homeTeamKey,
        teamName: fixture.homeTeam.name,
        players: homeStats,
      },
      awayTeam: {
        teamKey: fixture.awayTeamKey,
        teamName: fixture.awayTeam.name,
        players: awayStats,
      },
    };
  }
}
