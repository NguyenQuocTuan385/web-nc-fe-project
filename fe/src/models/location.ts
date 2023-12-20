import { Advertise, AdvertiseForm } from "./advertise";
import { Property } from "./property";

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
  advertises: Advertise[];
  address: string;
  images: string[];
  status_edit?: boolean;
  adsForm: AdvertiseForm;
  locationType: LocationType;
  property: Property;
  locationEditId?: number;
  createdAt?: string;
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
