import { Location, RandomLocation } from "./location";
import { Report } from "./report";

export interface Feature {
  type: string;
  properties: Location | RandomLocation;
  geometry: Geometry;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}
