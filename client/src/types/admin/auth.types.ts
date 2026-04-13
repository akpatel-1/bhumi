export interface LoginPayload {
  email: string;
  password: string;
}

export type AuthRole = 'admin' | 'registrar';

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}
