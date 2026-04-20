export type UserKycPayload = {
  pan_name: string;
  phone: string;
  address: string;
  pincode: string;
  district: string;
  state: string;
  pan_number: string;
};

export type UserSubmitKycPayload = UserKycPayload & {
  pan_document: File;
};

export type UserSubmitKycResponse = {
  success: boolean;
  message: string;
  data: null;
};

export type UserKycStatus = 'pending' | 'approved' | 'rejected';

export type UserKycStatusData = {
  user_id: string;
  status: UserKycStatus;
  rejection_reason: string | null;
  submitted_at: string;
};

export type UserKycStatusResponse = {
  success: boolean;
  message: string;
  data: UserKycStatusData | null;
};
