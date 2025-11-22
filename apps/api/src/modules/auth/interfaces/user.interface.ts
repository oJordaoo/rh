export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  roles: string[];
  refreshToken?: string;
}

export interface AuthenticatedUser {
  sub: string;
  email: string;
  name: string;
  roles: string[];
}
