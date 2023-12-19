export interface Advertise {
  id: number;
  lisencing: boolean;
  height: number;
  width: number;
  ads_type_name?: string;
  pillarQuantity?: number;
  images: string;
  companyImgUrl?: string;
  statusEdit?: boolean;
  adsType: AdvertiseType;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAdvertises {
  search?: string;
  pageSize?: number;
  current?: number;
}

export interface AdvertiseForm {
  id: number;
  name: string;
  description: string;
  created_at: Date;
}

export interface AdvertiseType {
  id: number;
  name: string;
  description: string;
  created_at: Date;
}
