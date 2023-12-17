import { Advertise } from "./advertise";

export interface Location {
  planning: boolean;
  address: string;
  ads_form_name: string;
  location_type_name: string;
  advertises: Advertise[];
  imgUrl: string;
}
