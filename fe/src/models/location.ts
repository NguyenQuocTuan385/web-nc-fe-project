import { AdvertiseForm } from "./advertise";
import { Property } from "./property";
import { Report } from "./report";
import { User } from "./user";

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
  locationEdit?: LocationEdit;
  createdAt?: string;
  titleReport?: string;
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
  status: boolean;
  locationEditId?: number;
}
