import { Advertise } from "./advertise";

export interface Contract {
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


export interface GetContract {
  status?: number;
  search?: string;
  pageSize?: number;
  current?: number;
}