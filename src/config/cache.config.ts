import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  ttl: {
    countries: 24 * 60 * 60 * 1000,
    leagues: 24 * 60 * 60 * 1000,
    teams: 12 * 60 * 60 * 1000,
    fixtures: 5 * 60 * 1000,
    standings: 30 * 60 * 1000,
    livescore: 2 * 60 * 1000,
  },
}));
