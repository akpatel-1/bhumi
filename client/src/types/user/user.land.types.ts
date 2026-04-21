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
