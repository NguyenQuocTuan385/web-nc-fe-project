import { Advertise } from "./advertise";

export interface Location {
  id: number;
  planning: boolean;
  address: string;
  ads_form_name: string;
  location_type_name: string;
  advertises: Advertise[];
  imgUrl: string;
  longitude: number;
  latitude: number;
  status_edit?: boolean;
}

export interface RandomLocation {
  address: string;
  longitude: number;
  latitude: number;
}
