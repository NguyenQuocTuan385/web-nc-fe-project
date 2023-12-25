import { Property } from "./property";
import { Role } from "./role";
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  birthday: Date;
  avatar: string;
  phone: string;
  role: Role;
  property: Property;
}
export interface GetUsers {
  roleId?: number;
  search?: string;
  pageSize?: number;
  current?: number;
}

export interface UserRequest {
  name: string;
  email: string;
  birthday: Date;
  avatar: string;
  password?: string;
  phone: string;
  roleId: number;
  propertyId: number;
}
