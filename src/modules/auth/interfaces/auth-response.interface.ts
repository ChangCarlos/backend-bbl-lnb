export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: UserResponse;
}

export interface LoginResponse {
  user: UserResponse;
}

export interface RefreshResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface MeResponse {
  user: UserResponse;
}
