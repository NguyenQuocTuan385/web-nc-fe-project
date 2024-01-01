import { Advertise } from "./advertise";
import { Location } from "./location";

export interface ReportForm {
  id: number;
  name: string;
  description: string;
  created_at: Date;
}

export interface Report {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  content: string;
  status: EReportStatus;
  reply: string;
  images: string;
  reportTypeName: EReportTypeName;
  reportForm: ReportForm;
  advertise?: Advertise;
  location?: Location;
  createdAt: Date;
}

export enum EReportTypeName {
  LOCATION_REPORT = 1,
  ADVERTISE_REPORT = 2
}

export enum EReportStatus {
  NEW = 1,
  PROCESSING = 2,
  DONE = 3
}

export interface GetReports {
  email?: string;
  locationId?: number;
  search?: string;
  pageSize?: number;
  current?: number;
}

export interface ReportEditRequest {
  status: number;
  reply: string;
}
