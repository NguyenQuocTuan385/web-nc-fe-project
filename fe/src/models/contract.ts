import { Advertise } from "./advertise";

export interface Contract {
  id: number;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  startAt: Date;
  endAt: Date;
  status: EContractStatus;
  images: string;
  advertise: Advertise;
}

export interface GetContract {
  status?: number;
  search?: string;
  pageSize?: number;
  current?: number;
}

export enum EContractStatus {
  licensed = 1,
  notLicensed = 2,
  expired = 3
}
