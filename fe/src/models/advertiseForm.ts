export interface AdvertiseForm {
  id: number;
  name: string;
  description: string;
}

export interface GetAdvertiseForms {
  search?: string;
  current?: number;
  pageSize?: number;
}

export interface Pageable {
  totalElements?: number;
  totalPages?: number;
  size?: number;
}
