export interface ReportForm {
  id: number;
  name: string;
  description: string;
}

export interface GetReportForms {
  search?: string;
  current?: number;
  pageSize?: number;
}

export interface Pageable {
  totalElements?: number;
  totalPages?: number;
  size?: number;
}
