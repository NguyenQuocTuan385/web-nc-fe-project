import { Location } from "./location";

export interface Advertise {
  id: number;
  lisencing: boolean;
  height: number;
  width: number;
  pillarQuantity?: number;
  images: string;
  statusEdit?: boolean;
  location: Location;
  adsType: AdvertiseType;
  createdAt: Date;
  updatedAt: Date;
}
export interface UpdateAdvertiseStatus {
  licensing: boolean;
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
export interface AdvertiseEditRequest {
  licensing: number;
  height: number;
  width: number;
  adsTypeId: number;
  locationId: number;
  pillarQuantity: number;
  userId: number;
  content: string;
  imageUrls: any;
}
