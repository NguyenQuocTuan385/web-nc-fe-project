import { Location, RandomLocation } from "./location";

export interface Feature {
  type: string;
  properties:
    | (Location & { isAdvertiseLocation?: boolean })
    | (RandomLocation & { isAdvertiseLocation?: boolean })
    | Location
    | RandomLocation;
  geometry: Geometry;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface GeoJson {
  type: string;
  features: Feature[];
}
