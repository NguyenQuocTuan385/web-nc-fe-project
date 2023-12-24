export interface ReportForm {
  id: number;
  name: string;
  description: string;
  created_at: Date;
}

export interface GetReports {
  search?: string;
  pageSize?: number;
  current?: number;
}
