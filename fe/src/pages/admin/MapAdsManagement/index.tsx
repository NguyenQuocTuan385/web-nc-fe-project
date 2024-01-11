import { useRef, useEffect, useState } from "react";
import MapLibreGL, { GeoJSONSource, MapGeoJSONFeature, Map as MapLibre, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import "@maptiler/geocoding-control/style.css";
import classes from "./styles.module.scss";
import * as maptilersdk from "@maptiler/sdk";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import { MapController } from "@maptiler/geocoding-control/types";
import { Feature, GeoJson } from "models/geojson";
import { Location, RandomLocation } from "models/location";
import PopoverHover from "./components/PopoverHover";
import LocationSidebar from "./components/LocationSidebar";
import RandomLocationSidebar from "./components/RandomLocationSidebar";
import LocationService from "services/location";
import { Box, IconButton, Switch } from "@mui/material";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";
import PopoverHelper from "./components/PopoverHelper";
import { Help } from "@mui/icons-material";

enum ELocationCheckedSwitch {
  BOTH = 1,
  LOCATION_IS_PLANNING = 2,
  LOCATION_IS_NOT_PLANNING = 3,
  NOT_AT_ALL = 4
}
const MapAdsManagementAdmin = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibre | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [zoom] = useState<number>(14);
  const [API_KEY] = useState<string>(process.env.REACT_APP_API_KEY_MAPTILER as string);
  const [openLocationSidebar, setOpenLocationSidebar] = useState<boolean>(false);
  const [location, setLocationData] = useState<Location | null>(null);
  const [randomLocation, setRandomLocationData] = useState<RandomLocation | null>(null);
  const [openRandomLocationSidebar, setOpenRandomLocationSidebar] = useState<boolean>(false);
  const marker = useRef<Marker | null>(null);
  maptilersdk.config.apiKey = API_KEY;
  const [mapController, setMapController] = useState<MapController>();
  const popup = new MapLibreGL.Popup({});
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const locationsIsPlanningNoAdvertises: Feature[] = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const locationsIsPlanningHasAdvertises: Feature[] = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const locationsIsNotPlanningNoAdvertises: Feature[] = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const locationsIsNotPlanningHasAdvertises: Feature[] = [];
  let clusters = useRef<Feature[]>([]);
  const [locationCheckedSwitch, setLocationCheckedSwitch] = useState<ELocationCheckedSwitch>(
    ELocationCheckedSwitch.BOTH
  );

  const closeAdsSidebar = () => {
    setOpenLocationSidebar(false);
  };

  const closeAddressSidebar = () => {
    setOpenRandomLocationSidebar(false);
  };

  useEffect(() => {
    const getAllLocations = async () => {
      const res = await LocationService.getLocationsByPropertyId(1, { pageSize: 9999 });

      const locations_temp: Location[] = res.content;
      if (lng === null && lat === null && locations_temp.length > 0) {
        setLng(locations_temp[0].longitude);
        setLat(locations_temp[0].latitude);
      }

      await Promise.all(
        locations_temp.map(async (location: Location) => {
          const existsAdvertises = await LocationService.checkExistsAdvertises(location.id);
          location.existsAdvertises = existsAdvertises;

          const feature: Feature = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [location.longitude, location.latitude]
            },
            properties: {
              ...location,
              isAdvertiseLocation: true
            }
          };

          if (location.planning) {
            existsAdvertises
              ? locationsIsPlanningHasAdvertises.push(feature)
              : locationsIsPlanningNoAdvertises.push(feature);
          } else {
            existsAdvertises
              ? locationsIsNotPlanningHasAdvertises.push(feature)
              : locationsIsNotPlanningNoAdvertises.push(feature);
          }
        })
      );
    };
    getAllLocations();
  }, [
    locationsIsPlanningHasAdvertises,
    locationsIsPlanningNoAdvertises,
    locationsIsNotPlanningHasAdvertises,
    locationsIsNotPlanningNoAdvertises
  ]);

  const handleClickSwitchLocationEvent = (propertyName: string) => {
    const currentMap = map.current;
    if (!currentMap) return;
    const visibility = currentMap.getLayoutProperty(propertyName, "visibility");
    if (!visibility || visibility === "visible") {
      currentMap.setLayoutProperty(propertyName, "visibility", "none");
    } else {
      currentMap.setLayoutProperty(propertyName, "visibility", "visible");
    }
  };

  const changeSourceDataLocation = (locationCheckedChange: ELocationCheckedSwitch) => {
    if (locationCheckedChange === ELocationCheckedSwitch.BOTH) {
      clusters.current = locationsIsNotPlanningHasAdvertises.concat(
        locationsIsNotPlanningNoAdvertises,
        locationsIsPlanningHasAdvertises,
        locationsIsPlanningNoAdvertises
      );
    } else if (locationCheckedChange === ELocationCheckedSwitch.LOCATION_IS_PLANNING) {
      clusters.current = locationsIsPlanningHasAdvertises.concat(locationsIsPlanningNoAdvertises);
    } else if (locationCheckedChange === ELocationCheckedSwitch.LOCATION_IS_NOT_PLANNING) {
      clusters.current = locationsIsNotPlanningHasAdvertises.concat(
        locationsIsNotPlanningNoAdvertises
      );
    } else {
      clusters.current = [];
    }
    (map.current?.getSource("locations") as GeoJSONSource)?.setData({
      type: "FeatureCollection",
      features: clusters.current as any
    });
  };

  const showPopup = (e: any) => {
    if (!map.current) return;
    map.current.getCanvas().style.cursor = "pointer";

    const coordinates = e.features[0].geometry.coordinates.slice();
    const properties = e.features[0].properties;
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const popupContainer = document.createElement("div");
    const root = ReactDOM.createRoot(popupContainer);
    root.render(createPortal(<PopoverHover properties={properties} />, popupContainer));

    popup.setLngLat(coordinates).setDOMContent(popupContainer).addTo(map.current);
  };
  const hidePopup = () => {
    if (!map.current) return;
    map.current.getCanvas().style.cursor = "";
    popup.remove();
  };

  const clickHandler = (e: any, layer_id: string) => {
    const map = e.target;
    const features: MapGeoJSONFeature[] = map.queryRenderedFeatures(e.point, {
      layers: [layer_id]
    });
    if (features.length > 0) {
      closeAddressSidebar();
      const {
        id,
        address,
        adsForm,
        images,
        locationType,
        planning,
        longitude,
        latitude,
        property
      } = features[0].properties;

      const locationTemp: Location = {
        id,
        address,
        adsForm: JSON.parse(adsForm),
        images: images,
        locationType: JSON.parse(locationType),
        planning,
        longitude,
        latitude,
        property: JSON.parse(property)
      };
      setLocationData(locationTemp);
      setOpenLocationSidebar(true);
    }
  };

  const loadLocationLayerFunction = (layerId: string) => {
    if (!map.current) return;
    map.current.on("mouseenter", layerId, (e) => showPopup(e));
    map.current.on("mouseleave", layerId, () => {
      hidePopup();
    });

    map.current.on("click", layerId, (e) => {
      clickHandler(e, layerId);
    });
  };

  useEffect(() => {
    if (map.current) return; // stops map from initializing more than once
    if (lng && lat) {
      map.current = new MapLibre({
        container: mapContainer.current as HTMLDivElement,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
        center: [lng, lat],
        zoom: zoom
      });

      map.current.addControl(new MapLibreGL.NavigationControl(), "top-right");
      map.current.addControl(new MapLibreGL.FullscreenControl());
      map.current.addControl(
        new MapLibreGL.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );
      setMapController(createMapLibreGlMapController(map.current, MapLibreGL));
      map.current.on("load", () => {
        if (!map.current) return;

        clusters.current = locationsIsNotPlanningHasAdvertises.concat(
          locationsIsNotPlanningNoAdvertises,
          locationsIsPlanningHasAdvertises,
          locationsIsPlanningNoAdvertises
        );

        const clustersGeojson: GeoJson = {
          type: "FeatureCollection",
          features: clusters.current
        };

        map.current.addSource("locations", {
          type: "geojson",
          data: clustersGeojson,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });

        map.current.addLayer({
          id: "clusters",
          type: "circle",
          source: "locations",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              5,
              "#f1f075",
              10,
              "#f28cb1"
            ],
            "circle-radius": ["step", ["get", "point_count"], 15, 5, 25, 10, 35]
          }
        });

        map.current.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "locations",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 12
          }
        });

        map.current.addLayer({
          id: "unclustered-location_is_planning_no_advertises",
          type: "circle",
          source: "locations",
          filter: [
            "all",
            ["!has", "point_count"],
            ["==", "planning", true],
            ["==", "existsAdvertises", false]
          ],
          paint: {
            "circle-color": "	#001aff",
            "circle-radius": 10
          }
        });

        map.current.addLayer({
          id: "unclustered-location_is_planning_no_advertises-text",
          type: "symbol",
          source: "locations",
          filter: [
            "all",
            ["!has", "point_count"],
            ["==", "planning", true],
            ["==", "existsAdvertises", false]
          ],
          layout: {
            "text-field": "QC",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 8
          },
          paint: {
            "text-color": "white"
          }
        });

        loadLocationLayerFunction("unclustered-location_is_planning_no_advertises");

        map.current.addLayer({
          id: "unclustered_location_is_planning_has_advertises",
          type: "circle",
          source: "locations",
          filter: [
            "all",
            ["!has", "point_count"],
            ["==", "planning", true],
            ["==", "existsAdvertises", true]
          ],
          paint: {
            "circle-color": "#fcc419",
            "circle-radius": 10
          }
        });

        map.current.addLayer({
          id: "unclustered_location_is_planning_has_advertises-text",
          type: "symbol",
          source: "locations",
          filter: [
            "all",
            ["!has", "point_count"],
            ["==", "planning", true],
            ["==", "existsAdvertises", true]
          ],
          layout: {
            "text-field": "QC",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 8
          },
          paint: {
            "text-color": "white"
          }
        });

        loadLocationLayerFunction("unclustered_location_is_planning_has_advertises");

        map.current.addLayer({
          id: "unclustered_location_is_not_planning_has_advertises",
          type: "circle",
          source: "locations",
          filter: [
            "all",
            ["!has", "point_count"],
            ["==", "planning", false],
            ["==", "existsAdvertises", true]
          ],
          paint: {
            "circle-color": "#ff0000",
            "circle-radius": 10
          }
        });

        loadLocationLayerFunction("unclustered_location_is_not_planning_has_advertises");

        map.current.addLayer({
          id: "unclustered_location_is_not_planning_has_advertises-text",
          type: "symbol",
          source: "locations",
          filter: [
            "all",
            ["!has", "point_count"],
            ["==", "planning", false],
            ["==", "existsAdvertises", true]
          ],
          layout: {
            "text-field": "QC",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 8
          },
          paint: {
            "text-color": "white"
          }
        });

        map.current.addLayer({
          id: "unclustered_location_is_not_planning_no_advertises",
          type: "circle",
          source: "locations",
          filter: [
            "all",
            ["!has", "point_count"],
            ["==", "planning", false],
            ["==", "existsAdvertises", false]
          ],
          paint: {
            "circle-color": "#f033c9",
            "circle-radius": 10
          }
        });

        map.current.addLayer({
          id: "unclustered_location_is_not_planning_no_advertises-text",
          type: "symbol",
          source: "locations",
          filter: [
            "all",
            ["!has", "point_count"],
            ["==", "planning", false],
            ["==", "existsAdvertises", false]
          ],
          layout: {
            "text-field": "QC",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 8
          },
          paint: {
            "text-color": "white"
          }
        });

        loadLocationLayerFunction("unclustered_location_is_not_planning_no_advertises");

        map.current.addLayer({
          id: "unclustered_report_location",
          type: "circle",
          source: "locations",
          filter: ["all", ["!has", "point_count"], ["==", "isAdvertiseLocation", false]],
          paint: {
            "circle-color": "#00b100",
            "circle-radius": 10
          }
        });

        map.current.addLayer({
          id: "unclustered_report_location-text",
          type: "symbol",
          source: "locations",
          filter: ["all", ["!has", "point_count"], ["==", "isAdvertiseLocation", false]],
          layout: {
            "text-field": "RP",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 8
          },
          paint: {
            "text-color": "white"
          }
        });

        map.current.on("mouseenter", "unclustered_report_location", (e) => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseleave", "unclustered_report_location", () => {
          if (map.current) map.current.getCanvas().style.cursor = "";
        });

        map.current.on("click", "unclustered_report_location", (e) => {
          const map = e.target;
          const features: MapGeoJSONFeature[] = map.queryRenderedFeatures(e.point, {
            layers: ["unclustered_report_location"]
          });
          if (features.length > 0) {
            closeAdsSidebar();
            setOpenRandomLocationSidebar(true);
            const { longitude, address, latitude } = features[0].properties;
            const randomLocationTemp: RandomLocation = {
              address: address,
              longitude: longitude,
              latitude: latitude
            };
            setRandomLocationData(randomLocationTemp);
          }
        });

        map.current.on("click", async (e) => {
          const map = e.target;
          const features = map.queryRenderedFeatures(e.point, {
            layers: [
              "unclustered_location_is_not_planning_has_advertises",
              "unclustered_location_is_not_planning_no_advertises",
              "unclustered-location_is_planning_no_advertises",
              "unclustered_location_is_planning_has_advertises",
              "unclustered_report_location",
              "clusters"
            ]
          });
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
                latitude: lat
              };
              setRandomLocationData(randomLocationTemp);
            } else {
              const { place_name_vi } = results.features[0];
              const coordinates = results.features[0].geometry.coordinates.slice();
              const randomLocationTemp: RandomLocation = {
                address: place_name_vi,
                longitude: coordinates[0],
                latitude: coordinates[1]
              };
              setRandomLocationData(randomLocationTemp);
              marker.current = new MapLibreGL.Marker().setLngLat(coordinates).addTo(map);
            }
          }
        });

        map.current.on("mouseenter", "clusters", (e) => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseleave", "clusters", () => {
          if (map.current) map.current.getCanvas().style.cursor = "";
        });
        map.current.on("click", "clusters", function (e) {
          if (!map.current) return;
          const features: any = map.current.queryRenderedFeatures(e.point, {
            layers: ["clusters"]
          });
          const clusterId = features[0].properties.cluster_id;
          const source: any = map.current.getSource("locations");
          source?.getClusterExpansionZoom(clusterId, function (err: any, zoom: any) {
            if (err || !map.current) return;
            map.current.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          });
        });
      });
    }
  }, [API_KEY, lng, lat, zoom]);

  return (
    <Box className={classes.mapWrap}>
      <Box className={classes.geocoding}>
        <GeocodingControl apiKey={API_KEY} language={"vi"} mapController={mapController} />
      </Box>
      <Box ref={mapContainer} className={classes.map}></Box>
      <Box className={classes.botNavbar}>
        <Box className={classes.botNavbarLeftWrapper}>
          <IconButton
            size='small'
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              setAnchorEl(event.currentTarget)
            }
          >
            <Help color='primary' />
          </IconButton>

          <Box className={classes.botNavbarItem}>
            <Switch
              defaultChecked
              onChange={(e: any) => {
                if (e.target.checked === true) {
                  if (locationCheckedSwitch === ELocationCheckedSwitch.LOCATION_IS_NOT_PLANNING) {
                    setLocationCheckedSwitch(ELocationCheckedSwitch.BOTH);
                    changeSourceDataLocation(ELocationCheckedSwitch.BOTH);
                  } else if (locationCheckedSwitch === ELocationCheckedSwitch.NOT_AT_ALL) {
                    setLocationCheckedSwitch(ELocationCheckedSwitch.LOCATION_IS_PLANNING);
                    changeSourceDataLocation(ELocationCheckedSwitch.LOCATION_IS_PLANNING);
                  }
                } else {
                  if (locationCheckedSwitch === ELocationCheckedSwitch.LOCATION_IS_PLANNING) {
                    setLocationCheckedSwitch(ELocationCheckedSwitch.NOT_AT_ALL);
                    changeSourceDataLocation(ELocationCheckedSwitch.NOT_AT_ALL);
                  } else if (locationCheckedSwitch === ELocationCheckedSwitch.BOTH) {
                    setLocationCheckedSwitch(ELocationCheckedSwitch.LOCATION_IS_NOT_PLANNING);
                    changeSourceDataLocation(ELocationCheckedSwitch.LOCATION_IS_NOT_PLANNING);
                  }
                }

                handleClickSwitchLocationEvent("unclustered-location_is_planning_no_advertises");
                handleClickSwitchLocationEvent("unclustered_location_is_planning_has_advertises");
                handleClickSwitchLocationEvent(
                  "unclustered-location_is_planning_no_advertises_text"
                );
                handleClickSwitchLocationEvent(
                  "unclustered_location_is_planning_has_advertises_text"
                );
              }}
            />
            <ParagraphSmall>Điểm đặt QC đã quy hoạch</ParagraphSmall>
          </Box>
          <Box className={classes.botNavbarItem}>
            <Switch
              defaultChecked
              onChange={(e: any) => {
                if (e.target.checked === true) {
                  if (locationCheckedSwitch === ELocationCheckedSwitch.LOCATION_IS_PLANNING) {
                    setLocationCheckedSwitch(ELocationCheckedSwitch.BOTH);
                    changeSourceDataLocation(ELocationCheckedSwitch.BOTH);
                  } else if (locationCheckedSwitch === ELocationCheckedSwitch.NOT_AT_ALL) {
                    setLocationCheckedSwitch(ELocationCheckedSwitch.LOCATION_IS_NOT_PLANNING);
                    changeSourceDataLocation(ELocationCheckedSwitch.LOCATION_IS_NOT_PLANNING);
                  }
                } else {
                  if (locationCheckedSwitch === ELocationCheckedSwitch.LOCATION_IS_NOT_PLANNING) {
                    setLocationCheckedSwitch(ELocationCheckedSwitch.NOT_AT_ALL);
                    changeSourceDataLocation(ELocationCheckedSwitch.NOT_AT_ALL);
                  } else if (locationCheckedSwitch === ELocationCheckedSwitch.BOTH) {
                    setLocationCheckedSwitch(ELocationCheckedSwitch.LOCATION_IS_PLANNING);
                    changeSourceDataLocation(ELocationCheckedSwitch.LOCATION_IS_PLANNING);
                  }
                }

                handleClickSwitchLocationEvent(
                  "unclustered_location_is_not_planning_has_advertises"
                );
                handleClickSwitchLocationEvent(
                  "unclustered_location_is_not_planning_no_advertises"
                );
                handleClickSwitchLocationEvent(
                  "unclustered_location_is_not_planning_has_advertises_text"
                );
                handleClickSwitchLocationEvent(
                  "unclustered_location_is_not_planning_no_advertises_text"
                );
              }}
            />
            <ParagraphSmall>Điểm đặt QC chưa quy hoạch</ParagraphSmall>
          </Box>
        </Box>
      </Box>
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
      <PopoverHelper anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </Box>
  );
};

export default MapAdsManagementAdmin;
