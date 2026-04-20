export interface CreateRegistrarPayload {
  email: string;
  password: string;
  district: string;
}

export interface RegistrarSummary {
  id: string;
  email: string;
  district: string;
  createdAt: string;
}

export interface CreateRegistrarResponse {
  success: boolean;
  message: string;
  data: RegistrarSummary;
}
