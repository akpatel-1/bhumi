export interface UserLandDetails {
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

export type UserLandDetailsResponse = Omit<UserLandDetails, 'image_r2_key'> & {
  image_url: string | null;
};
