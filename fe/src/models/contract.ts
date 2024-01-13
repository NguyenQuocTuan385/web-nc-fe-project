import { companyPhone } from "assets/img/icon/ic-comPhone.svg";
import { companyAddress } from "assets/img/icon/ic-comAddress.svg";
import { compamyEmail } from "assets/img/icon/ic-comEmail.svg";
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
  createdAt: Date;
}

export interface PutContract {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyPhone: string;
  images: string;
  startAt: string;
  endAt: string;
  advertiseId: number;
}

export interface UpdateContractStatus {
  status: number;
}

export interface GetContract {
  propertyId?: number[];
  parentId?: number[];
  status?: number;
  search?: string;
  pageSize?: number;
  current?: number;
}

export enum EContractStatus {
  licensed = 1,
  notLicensed = 2,
  expired = 3,
  rejected = 4
}

export interface DynamicObject {
  [key: string]: any;
}
