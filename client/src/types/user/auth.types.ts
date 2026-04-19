export interface UserEmailPayload {
  email: string;
}

export interface UserVerifyOtpPayload {
  email: string;
  otp: string;
}

export interface UserSessionUser {
  userId: string;
  role: 'user';
}

export interface UserGetMeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    role: 'user';
  };
}

export interface UserVerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    role: 'user';
  };
}

export interface UserRequestOtpResponse {
  success: boolean;
  message: string;
  data: null;
}
