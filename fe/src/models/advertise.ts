import { Location } from "./location";
import { User } from "./user";

export interface Advertise {
  id: number;
  licensing: boolean;
  height: number;
  width: number;
  pillarQuantity?: number;
  images: string;
  statusEdit?: boolean;
  location: Location;
  adsType: AdvertiseType;
  advertiseEdit?: AdvertiseEdit;
  createdAt: Date;
  updatedAt: Date;
}
export interface UpdateAdvertiseStatus {
  licensing: boolean;
}
export interface GetAdvertises {
  propertyId?: number;
  parentId?: number;
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

export interface AdvertiseEdit {
  id: number;
  lisensing: boolean;
  height: number;
  width: number;
  content: string;
  images: string;
  location: Location;
  adsType: AdvertiseType;
  createdAt: Date;
  user: User;
}

export interface UpdateStatus {
  status: boolean;
  advertiseEditId?: number;
}

export interface UpdateAdvertise {
  licensing: boolean;
  height: number;
  width: number;
  pillarQuantity: number;
  images: string;
  locationId: number;
  adsTypeId: number;
}

export enum TAB_ADVERTISE {
  location = 1,
  advertise = 2
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
