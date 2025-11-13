export interface JwtPayload {
  sub: string;
  email: string;
}

export interface JwtRefreshPayload {
  sub: string;
}
