import { registerAs } from "@nestjs/config";

export default registerAs('basketballApi', () => ({
    apiKey: process.env.BASKETBALL_API_KEY,
    apiUrl: process.env.BASKETBALL_API_URL,
}));