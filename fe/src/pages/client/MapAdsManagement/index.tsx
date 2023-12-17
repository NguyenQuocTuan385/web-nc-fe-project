import React, { useRef, useEffect, useState } from "react";
import MapLibreGL, { Map as MapLibre, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import "@maptiler/geocoding-control/style.css";
import classes from "./styles.module.scss";
import "./styles.module.scss";
import ReactDOM from "react-dom";
import Popup from "../../../components/client/PopupHover";
import AdsSidebar from "../../../components/client/LocationSidebar";
import AddressSidebar from "../../../components/client/AnyLocationSidebar";
import * as maptilersdk from "@maptiler/sdk";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import { MapController } from "@maptiler/geocoding-control/types";

const MapAdsManagement = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibre | null>(null);
  const [lng] = useState<number>(106.715167);
  const [lat] = useState<number>(10.807035);
  const [zoom] = useState<number>(14);
  const [API_KEY] = useState<string>("MijgZpLFV2J9ejlH3Ot2");
  const [isOpenAdsSidebar, setIsOpenAdsSideBar] = useState<boolean>(false);
  const [isOpenAddressSidebar, setIsOpenAddressSideBar] =
    useState<boolean>(false);
  const marker = useRef<Marker | null>(null);
  maptilersdk.config.apiKey = API_KEY;
  const [mapController, setMapController] = useState<MapController>();

  const popup = new MapLibreGL.Popup({
    closeOnClick: false,
  });

  const closeAdsSidebar = () => {
    setIsOpenAdsSideBar(false);
  };

  const closeAddressSidebar = () => {
    setIsOpenAddressSideBar(false);
  };

  function showPopup(e: any) {
    if (!map.current) return;
    map.current.getCanvas().style.cursor = "pointer";

    const coordinates = e.features[0].geometry.coordinates.slice();
    const properties = e.features[0].properties;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const popupNode = document.createElement("div");
    ReactDOM.render(<Popup properties={properties} />, popupNode);
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
          features: [
            {
              type: "Feature",
              properties: {
                planning: true,
                address: "227 Nguyễn Văn Cừ, Phường 16, Q.5",
                ads_form_name: "Cổ động chính trị, Quảng cáo thương mại",
                location_type_name:
                  "Đất công/Công viên/Hành lang an toàn giao thông",
              },
              geometry: {
                type: "Point",
                coordinates: [106.696002, 10.806579],
              },
            },
            {
              type: "Feature",
              properties: {
                planning: false,
                address: "114 Nguyễn Văn Cừ, Phường 16, Q.5",
                ads_form_name: "Cổ động chính trị, Quảng cáo thương mại",
                location_type_name:
                  "Đất công/Công viên/Hành lang an toàn giao thông",
              },
              geometry: {
                type: "Point",
                coordinates: [106.69282625956525, 10.808360001977254],
              },
            },
            {
              type: "Feature",
              properties: {
                planning: true,
                address: "100 Lê Văn Sỹ, Phường 16, Q.5",
                ads_form_name: "Cổ động chính trị, Quảng cáo thương mại",
                location_type_name:
                  "Đất công/Công viên/Hành lang an toàn giao thông",
              },
              geometry: {
                type: "Point",
                coordinates: [106.69212623062919, 10.80612598101489],
              },
            },
          ],
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
      const features = map.queryRenderedFeatures(e.point, { layers: ["ads"] });
      if (features.length > 0) {
        closeAddressSidebar();
        setIsOpenAdsSideBar(true);
      }
    });

    map.current.on("click", async (e) => {
      const map = e.target;
      const features = map.queryRenderedFeatures(e.point, { layers: ["ads"] });
      if (features.length > 0) {
        return;
      } else {
        closeAdsSidebar();
        setIsOpenAddressSideBar(true);
        const { lng, lat } = e.lngLat;
        const results: any = await maptilersdk.geocoding.reverse([lng, lat]);
        if (marker.current) {
          marker.current.setLngLat([lng, lat]);
        } else {
          const coordinates = results.features[0].geometry.coordinates.slice();
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
      <AdsSidebar isOpen={isOpenAdsSidebar} closeSidebar={closeAdsSidebar} />
      <AddressSidebar
        isOpen={isOpenAddressSidebar}
        closeSidebar={closeAddressSidebar}
      />
    </div>
  );
};

export default MapAdsManagement;
