export interface LandDetails {
  land_id: string;
  plot_no: string;
  district: string;
  tehsil: string;
  village: string;
  area_sqm: string;
  land_type: string;
  image_r2_key: string | null;
  acquired_at: Date;
  transaction_type: string;
}

export type LandDetailsResponse = Omit<LandDetails, 'image_r2_key' | 'land_id'> & {
  image_url: string | null;
};

export interface LandHistoryDetails {
  block_hash: string;
  previous_hash: string | null;
  payload: unknown;
  created_at: Date;
  transaction_type: string;
  status: string;
  from_user_id: string;
  from_name: string | null;
  to_user_id: string;
  to_name: string | null;
}

export interface LandHistoryResponse {
  block_number: number;
  block_hash: string;
  transaction_type: string;
  status: string;
  from: {
    name: string;
  };
  to: {
    name: string | null;
  };
  timestamp: Date;
}

export interface VillageLandRecord {
  land_id: string;
  plot_no: string;
  district: string;
  tehsil: string;
  village: string;
  area_sqm: string;
  land_type: string;
  image_r2_key: string | null;
}

export type VillageLandResponse = Omit<VillageLandRecord, 'image_r2_key' | 'land_id'> & {
  image_url: string | null;
};
