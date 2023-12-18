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

const MapAdsManagement = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibre | null>(null);
  const [lng] = useState<number>(106.715167);
  const [lat] = useState<number>(10.807035);
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

  const locations: Feature[] = [
    {
      type: "Feature",
      properties: {
        id: 1,
        planning: true,
        address: "227 Nguyễn Văn Cừ, Phường 16, Q.5",
        ads_form_name: "Cổ động chính trị",
        location_type_name: "Đất công/Công viên/Hành lang an toàn giao thông",
        longitude: 106.696002,
        latitude: 10.806579,
        advertises: [
          {
            id: 1,
            lisencing: true,
            height: 2.5,
            width: 10,
            ads_type_name: "Trụ bảng hiflex",
            pillar_quantity: 1,
            imgUrl:
              "https://bianviet.com/uploads/images/4/images/Bi%E1%BB%83n%20qu%E1%BA%A3ng%20c%C3%A1o%281%29.jpg",
            companyImgUrl:
              "https://assets.unileversolutions.com/v1/52397810.jpg",
          },
          {
            id: 2,
            lisencing: false,
            height: 2,
            width: 10,
            ads_type_name: "Trụ màn hình điện tử LED",
            pillar_quantity: 2,
            imgUrl:
              "https://bianviet.com/uploads/images/4/images/Bi%E1%BB%83n%20qu%E1%BA%A3ng%20c%C3%A1o%281%29.jpg",
            companyImgUrl:
              "https://assets.unileversolutions.com/v1/52397810.jpg",
          },
        ],
        imgUrl:
          "https://goldsungroup.com.vn/wp-content/uploads/2019/11/bien-quang-cao-mot-cot-tren-duong-quoc-lo.jpg",
      },
      geometry: {
        type: "Point",
        coordinates: [106.696002, 10.806579],
      },
    },
    {
      type: "Feature",
      properties: {
        id: 2,
        planning: false,
        address: "114 Nguyễn Văn Cừ, Phường 16, Q.5",
        ads_form_name: "Cổ động chính trị",
        location_type_name: "Đất công/Công viên/Hành lang an toàn giao thông",
        longitude: 106.69282625956525,
        latitude: 10.808360001977254,
        advertises: [
          {
            id: 3,
            lisencing: true,
            height: 2.5,
            width: 10,
            ads_type_name: "Trụ bảng hiflex",
            pillar_quantity: 1,
            imgUrl:
              "https://bianviet.com/uploads/images/4/images/Bi%E1%BB%83n%20qu%E1%BA%A3ng%20c%C3%A1o%281%29.jpg",
            companyImgUrl:
              "https://assets.unileversolutions.com/v1/52397810.jpg",
          },
          {
            id: 4,
            lisencing: false,
            height: 2,
            width: 10,
            ads_type_name: "Trụ màn hình điện tử LED",
            pillar_quantity: 2,
            imgUrl:
              "https://bianviet.com/uploads/images/4/images/Bi%E1%BB%83n%20qu%E1%BA%A3ng%20c%C3%A1o%281%29.jpg",
          },
        ],
        imgUrl:
          "https://quangcaongoaitroi.com/wp-content/uploads/2020/02/Unique-OOH-bien-quang-cao-billboard-tren-duong-cao-toc-16.jpg",
      },
      geometry: {
        type: "Point",
        coordinates: [106.69282625956525, 10.808360001977254],
      },
    },
    {
      type: "Feature",
      properties: {
        id: 3,
        planning: true,
        address: "100 Lê Văn Sỹ, Phường 16, Q.5",
        ads_form_name: "Cổ động chính trị",
        location_type_name: "Đất công/Công viên/Hành lang an toàn giao thông",
        longitude: 106.69212623062919,
        latitude: 10.80612598101489,
        advertises: [
          {
            id: 5,
            lisencing: true,
            height: 2.5,
            width: 10,
            ads_type_name: "Trụ bảng hiflex",
            pillar_quantity: 1,
            imgUrl:
              "https://bianviet.com/uploads/images/4/images/Bi%E1%BB%83n%20qu%E1%BA%A3ng%20c%C3%A1o%281%29.jpg",
          },
          {
            id: 6,
            lisencing: false,
            height: 2,
            width: 10,
            ads_type_name: "Trụ màn hình điện tử LED",
            pillar_quantity: 2,
            imgUrl:
              "https://bianviet.com/uploads/images/4/images/Bi%E1%BB%83n%20qu%E1%BA%A3ng%20c%C3%A1o%281%29.jpg",
          },
        ],
        imgUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAXpcpxWHcMfZCIH177N18yzSxt6wdU5L-Og&usqp=CAU",
      },
      geometry: {
        type: "Point",
        coordinates: [106.69212623062919, 10.80612598101489],
      },
    },
  ];

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
          ads_form_name,
          imgUrl,
          location_type_name,
          planning,
          longitude,
          latitude,
        } = features[0].properties;

        const locationTemp: Location = {
          id,
          address,
          advertises: JSON.parse(advertises),
          ads_form_name,
          imgUrl,
          location_type_name,
          planning,
          longitude,
          latitude,
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
