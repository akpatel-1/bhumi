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

export interface GetMeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    role: AuthRole;
  };
}

export interface SessionUser {
  userId: string;
  role: AuthRole;
}

export interface AdminRegistrarListItem {
  district: string;
  created_at: string;
}

export interface GetAllRegistrarResponse {
  success: boolean;
  message: string;
  data: AdminRegistrarListItem[];
}
