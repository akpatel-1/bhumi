export type RegistrarKycStatus = 'pending' | 'approved' | 'rejected';

export type RegistrarUserKycItem = {
  user_id: string;
  pan_name: string;
  phone: string;
  address: string;
  pincode: string;
  district: string;
  pan_number?: string;
  pan_document_url: string;
  rejection_reason?: string | null;
  submitted_at?: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
};

export type RegistrarGetUserKycResponse = {
  success: boolean;
  message: string;
  data: RegistrarUserKycItem[];
};
