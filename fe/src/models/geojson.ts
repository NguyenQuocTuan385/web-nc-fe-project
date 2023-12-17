import { Location } from "./location";

export interface Feature {
  type: string;
  properties: Location;
  geometry: Geometry;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}
