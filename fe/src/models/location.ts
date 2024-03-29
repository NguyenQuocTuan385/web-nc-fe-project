import { AdvertiseForm } from "./advertise";
import { Property } from "./property";
import { User } from "./user";

export interface RandomLocation {
  id?: number;
  address: string;
  longitude: number;
  latitude: number;
  reportStatus?: string;
}

export interface Location {
  id: number;
  planning: boolean;
  longitude: number;
  latitude: number;
  address: string;
  images: string;
  status_edit?: boolean;
  adsForm: AdvertiseForm;
  locationType: LocationType;
  property: Property;
  locationEdit?: LocationEdit;
  createdAt?: string;
  reportStatus?: string;
  existsAdvertises?: boolean;
}

export interface LocationView {
  stt: number;
  address: string;
  adsForm: string;
  locationType: string;
  planning: number;
  latitude: number;
  longtitude: number;
  images: string[];
}

export interface LocationType {
  id: number;
  name: string;
  description: string;
  created_at: Date;
}

export interface GetLocations {
  propertyId?: number;
  parentId?: number;
  search?: string;
  pageSize?: number;
  current?: number;
}

export interface GetLocationsWithPropertyArray {
  propertyId?: number[];
  parentId?: number[];
  search?: string;
  pageSize?: number;
  current?: number;
}

export interface LocationEdit {
  id: number;
  planning: boolean;
  longitude: number;
  latitude: number;
  address: string;
  images: string;
  content: string;
  locationType: LocationType;
  property: Property;
  adsForm: AdvertiseForm;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface putLocation {
  planning: boolean;
  longitude: number;
  latitude: number;
  address: string;
  advertiseFormId: number;
  locationTypeId: number;
  propertyId: number;
  imageUrls: string;
}

export interface updateStatus {
  statusEdit: boolean;
}

export interface GetLocationTypes {
  search?: string;
  pageSize?: number;
  current?: number;
}

export interface LocationEditRequest {
  address: string;
  locationTypeId: number;
  advertiseFormId: number;
  planning: number;
  imageUrls: any;
  latitude: number;
  longitude: number;
  propertyId: number;
  userId: number;
  content: string;
}

export interface LocationEditByCDMSRequest {
  address: string;
  locationTypeId: number;
  advertiseFormId: number;
  planning: number;
  imageUrls: any;
  latitude: number;
  longitude: number;
  propertyId: number;
  userId: number;
}

export interface LocationCreateRequest {
  planning: number;
  latitude: number;
  longitude: number;
  address: string;
  advertiseFormId: number;
  locationTypeId: number;
  propertyId: number;
  image: any;
}
