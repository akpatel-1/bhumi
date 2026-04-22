export type UserProfileInfo = {
  user_id: string;
  email: string;
  role: 'user';
  pan_name: string | null;
  phone: string | null;
  district: string | null;
  is_suspended: boolean | null;
  suspension_reason: string | null;
  created_at: string | null;
};

export type UserProfileResponse = {
  success: boolean;
  message: string;
  data: UserProfileInfo;
};
