export interface Property {
  id: number;
  propertyParent?: Property;
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
  ward?: string;
  district?: string;
}

export interface PropertyRequest {
  id?: number;
  name: string;
  code: string;
}

export interface PropertyCreateRequest {
  propertyParentId?: number;
  name: string;
  code: string;
}
