import { Advertise } from "./advertise";

export interface Welcome {
  id:             number;
  companyName:    string;
  companyEmail:   string;
  companyPhone:   string;
  companyAddress: string;
  startAt:        Date;
  endAt:          Date;
  status:         number;
  images:         string;
  advertise:      Advertise;
}

export interface Advertise {
    id:             number;
    licensing:      boolean;
    height:         number;
    width:          number;
    statusEdit:     null;
    images:         string;
    pillarQuantity: null;
    location:       Location;
    adsType:        AdsType;
    createdAt:      Date;
    updatedAt:      Date;
}


export interface GetContract {
  search?: string;
  pageSize?: number;
  current?: number;
}