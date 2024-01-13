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
  guestEmail: string;
  phone: string;
  content: string;
  status: EReportStatus;
  reply: string;
  images: string;
  reportTypeName: EReportType;
  reportForm: ReportForm;
  advertise?: Advertise;
  address?: string;
  longitude?: number;
  latitude?: number;
  createdAt: Date;
}

export enum EReportType {
  LOCATION = "LOCATION",
  ADVERTISE = "ADVERTISE"
}

export enum EReportStatus {
  NEW = 1,
  PROCESSING = 2,
  DONE = 3
}

export interface GetReports {
  propertyId?: number[];
  parentId?: number[];
  email?: string;
  locationId?: number;
  search?: string;
  pageSize?: number;
  current?: number;
  reportTypeName?: EReportType;
}

export interface ReportEditRequest {
  status: number;
  reply: string | null | undefined;
}

export interface ReportCreateRequest {
  reportFormId: number;
  fullName: string;
  email: string;
  phone: string;
  content: string;
  guestEmail: string;
  images: string;
  reportTypeName: EReportType;
  address?: string;
  longitude?: number;
  latitude?: number;
  advertiseId?: number;
  userId?: number;
}
