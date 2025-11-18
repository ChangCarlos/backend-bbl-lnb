export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

export interface JwtRefreshPayload {
  sub: string;
}
