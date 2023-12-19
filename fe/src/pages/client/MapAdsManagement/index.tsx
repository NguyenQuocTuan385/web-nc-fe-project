import React, { useRef, useEffect, useState } from "react";
import MapLibreGL, {
  MapGeoJSONFeature,
  Map as MapLibre,
  Marker,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import "@maptiler/geocoding-control/style.css";
import classes from "./styles.module.scss";
import ReactDOM from "react-dom";
import * as maptilersdk from "@maptiler/sdk";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import { MapController } from "@maptiler/geocoding-control/types";
import { Feature } from "models/geojson";
import { Location, RandomLocation } from "models/location";
import PopoverHover from "./components/PopoverHover";
import LocationSidebar from "./components/LocationSidebar";
import RandomLocationSidebar from "./components/RandomLocationSidebar";
import LocationService from "services/location";
const MapAdsManagement = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibre | null>(null);
  const [lng] = useState<number>(106.68207417234699);
  const [lat] = useState<number>(10.764659325041498);
  const [zoom] = useState<number>(14);
  const [API_KEY] = useState<string>("MijgZpLFV2J9ejlH3Ot2");
  const [openLocationSidebar, setOpenLocationSidebar] =
    useState<boolean>(false);
  const [location, setLocationData] = useState<Location | null>(null);
  const [randomLocation, setRandomLocationData] =
    useState<RandomLocation | null>(null);
  const [openRandomLocationSidebar, setOpenRandomLocationSidebar] =
    useState<boolean>(false);
  const marker = useRef<Marker | null>(null);
  maptilersdk.config.apiKey = API_KEY;
  const [mapController, setMapController] = useState<MapController>();
  const popup = new MapLibreGL.Popup({
    closeOnClick: false,
  });
  const closeAdsSidebar = () => {
    setOpenLocationSidebar(false);
  };

  const closeAddressSidebar = () => {
    setOpenRandomLocationSidebar(false);
  };
  const locations: Feature[] = [];
  useEffect(() => {
    const getAllLocations = async () => {
      LocationService.getLocations({ pageSize: 9999 })
        .then((res) => {
          const locations_temp: Location[] = res.content.map(
            (location: any) => ({
              ...location,
              images: JSON.parse(location.images as string),
            })
          );
          locations_temp.map((location: Location) => {
            const feature: Feature = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [location.longitude, location.latitude],
              },
              properties: {
                ...location,
              },
            };
            locations.push(feature);
            return feature;
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getAllLocations();
  }, []);

  function showPopup(e: any) {
    if (!map.current) return;
    map.current.getCanvas().style.cursor = "pointer";

    const coordinates = e.features[0].geometry.coordinates.slice();
    const properties = e.features[0].properties;
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const popupNode = document.createElement("div");
    ReactDOM.render(<PopoverHover properties={properties} />, popupNode);
    popup
      .setLngLat(coordinates)
      .setHTML(popupNode.innerHTML)
      .addTo(map.current);
  }

  useEffect(() => {
    if (map.current) return; // stops map from initializing more than once

    map.current = new MapLibre({
      container: mapContainer.current as HTMLDivElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.addControl(new MapLibreGL.NavigationControl(), "top-right");
    map.current.addControl(new MapLibreGL.FullscreenControl());
    map.current.addControl(
      new MapLibreGL.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
    setMapController(createMapLibreGlMapController(map.current, MapLibreGL));
    map.current.on("load", () => {
      if (!map.current) return;
      map.current.addSource("ads", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: locations,
        },
      });

      map.current.addLayer({
        id: "ads",
        type: "circle",
        source: "ads",
        paint: {
          "circle-color": "#4264fb",
          "circle-radius": 8,
        },
      });
    });

    map.current.on("mouseenter", "ads", (e) => showPopup(e));
    map.current.on("mouseleave", "ads", () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = "";
      popup.remove();
    });
    map.current.on("click", "ads", (e) => {
      const map = e.target;
      const features: MapGeoJSONFeature[] = map.queryRenderedFeatures(e.point, {
        layers: ["ads"],
      });
      if (features.length > 0) {
        closeAddressSidebar();
        const {
          id,
          advertises,
          address,
          adsForm,
          images,
          locationType,
          planning,
          longitude,
          latitude,
          property,
        } = features[0].properties;

        const locationTemp: Location = {
          id,
          address,
          advertises: JSON.parse(advertises),
          adsForm: JSON.parse(adsForm),
          images: JSON.parse(images),
          locationType: JSON.parse(locationType),
          planning,
          longitude,
          latitude,
          property: JSON.parse(property),
        };
        setLocationData(locationTemp);
        setOpenLocationSidebar(true);
      }
    });

    map.current.on("click", async (e) => {
      const map = e.target;
      const features = map.queryRenderedFeatures(e.point, { layers: ["ads"] });
      if (features.length > 0) {
        return;
      } else {
        const { lng, lat } = e.lngLat;
        const results: any = await maptilersdk.geocoding.reverse([lng, lat]);
        closeAdsSidebar();
        setOpenRandomLocationSidebar(true);
        if (marker.current) {
          marker.current.setLngLat([lng, lat]);
          const { place_name_vi } = results.features[0];
          const randomLocationTemp: RandomLocation = {
            address: place_name_vi,
            longitude: lng,
            latitude: lat,
          };
          setRandomLocationData(randomLocationTemp);
        } else {
          const { place_name_vi } = results.features[0];
          const coordinates = results.features[0].geometry.coordinates.slice();
          const randomLocationTemp: RandomLocation = {
            address: place_name_vi,
            longitude: coordinates[0],
            latitude: coordinates[1],
          };
          setRandomLocationData(randomLocationTemp);
          marker.current = new MapLibreGL.Marker()
            .setLngLat(coordinates)
            .addTo(map);
        }
      }
    });
  }, [API_KEY, lng, lat, zoom]);

  return (
    <div className={classes.mapWrap}>
      <div className={classes.geocoding}>
        <GeocodingControl
          apiKey={API_KEY}
          language={"vi"}
          mapController={mapController}
        />
      </div>
      <div ref={mapContainer} className={classes.map} />
      <LocationSidebar
        isOpen={openLocationSidebar}
        closeSidebar={closeAdsSidebar}
        location={location}
      />
      <RandomLocationSidebar
        isOpen={openRandomLocationSidebar}
        closeSidebar={closeAddressSidebar}
        randomLocation={randomLocation}
      />
    </div>
  );
};

export default MapAdsManagement;
