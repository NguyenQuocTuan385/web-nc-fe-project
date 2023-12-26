export interface AdvertiseType {
  id: number;
  name: string;
  description: string;
}

export interface GetAdvertiseTypes {
  search?: string;
  current?: number;
  pageSize?: number;
}

export interface Pageable {
  totalElements?: number;
  totalPages?: number;
  size?: number;
}
