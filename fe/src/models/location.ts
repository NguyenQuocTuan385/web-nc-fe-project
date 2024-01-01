import { AdvertiseForm } from "./advertise";
import { Property } from "./property";
import { Report } from "./report";

export interface RandomLocation {
  address: string;
  longitude: number;
  latitude: number;
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
  locationEditId?: number;
  createdAt?: string;
  titleReport?: string;
}

export interface LocationView {
  stt: number;
  id: number;
  address: string;
  adsForm: string;
  locationType: string;
  planning: number;
  latitude: number;
  longtitude: number;
  images: string;
}

export interface LocationType {
  id: number;
  name: string;
  description: string;
  created_at: Date;
}

export interface GetLocations {
  search?: string;
  pageSize?: number;
  current?: number;
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
