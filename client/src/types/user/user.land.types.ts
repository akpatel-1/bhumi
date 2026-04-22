export type UserLandDetailsItem = {
  land_id: string;
  plot_no: string;
  district: string;
  tehsil: string;
  village: string;
  area_sqm: string;
  land_type: string;
  acquired_at: string;
  transaction_type: string;
  image_url: string | null;
};

export type UserLandDetailsResponse = {
  success: boolean;
  message: string;
  data: UserLandDetailsItem[];
};

export type UserLandSearchFilter = {
  district: string;
  tehsil: string;
  village: string;
};

export type UserLandSearchItem = {
  plot_no: string;
  district: string;
  tehsil: string;
  village: string;
  area_sqm: string;
  land_type: string;
  image_url: string | null;
};

export type UserLandSearchResponse = {
  success: boolean;
  message: string;
  data: UserLandSearchItem[];
};

export type UserLandHistoryPageParty = {
  name: string;
};

export type UserLandHistoryPageItem = {
  block_number: number;
  block_hash: string;
  transaction_type: string;
  status: string;
  district: string;
  tehsil: string;
  village: string;
  area_sqm: string;
  image_url: string | null;
  acquired_at: string;
  from: UserLandHistoryPageParty;
  to: UserLandHistoryPageParty;
  timestamp: string;
};

export type UserLandHistoryPageResponse = {
  success: boolean;
  message: string;
  data: UserLandHistoryPageItem[];
};
