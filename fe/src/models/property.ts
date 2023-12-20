export interface Property {
  id: number;
  propertyParentId?: number;
  name: string;
  code: string;
}

export interface Pageable {
  totalElements?: number;
  totalPages?: number;
  size?: number;
}

export interface GetProperties {
  search?: string;
  pageSize?: number;
  current?: number;
}
