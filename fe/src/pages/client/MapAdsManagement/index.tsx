import { useRef, useEffect, useState } from "react";
import MapLibreGL, { MapGeoJSONFeature, Map as MapLibre, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import "@maptiler/geocoding-control/style.css";
import classes from "./styles.module.scss";
import * as maptilersdk from "@maptiler/sdk";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import { MapController } from "@maptiler/geocoding-control/types";
import { Feature } from "models/geojson";
import { Location, RandomLocation } from "models/location";
import PopoverHover from "./components/PopoverHover";
import LocationSidebar from "./components/LocationSidebar";
import RandomLocationSidebar from "./components/RandomLocationSidebar";
import LocationService from "services/location";
import { Box, Button, Switch } from "@mui/material";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { EReportStatus, EReportType, Report } from "models/report";
import ReportService from "services/report";
import ReportInfoPopup from "./components/ReportListPopup";
import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";

const MapAdsManagement = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibre | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [zoom] = useState<number>(14);
  const [API_KEY] = useState<string>(process.env.REACT_APP_API_KEY_MAPTILER as string);
  const [openLocationSidebar, setOpenLocationSidebar] = useState<boolean>(false);
  const [openReportInfoPopup, setOpenReportInfoPopup] = useState<boolean>(false);
  const [location, setLocationData] = useState<Location | null>(null);
  const [randomLocation, setRandomLocationData] = useState<RandomLocation | null>(null);
  const [openRandomLocationSidebar, setOpenRandomLocationSidebar] = useState<boolean>(false);
  const marker = useRef<Marker | null>(null);
  maptilersdk.config.apiKey = API_KEY;
  const [mapController, setMapController] = useState<MapController>();
  const popup = new MapLibreGL.Popup({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const locationsIsPlanning: Feature[] = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const locationsIsNotPlanning: Feature[] = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reportLocations: Feature[] = [];
  const closeAdsSidebar = () => {
    setOpenLocationSidebar(false);
  };

  const closeAddressSidebar = () => {
    setOpenRandomLocationSidebar(false);
  };

  useEffect(() => {
    const getAllLocations = async () => {
      LocationService.getLocations({ pageSize: 9999 })
        .then((res) => {
          const locations_temp: Location[] = res.content;
          if (lng === null && lat === null && locations_temp.length > 0) {
            setLng(locations_temp[0].longitude);
            setLat(locations_temp[0].latitude);
          }
          locations_temp.forEach((location: Location) => {
            ReportService.getReports({
              locationId: location.id,
              pageSize: 999,
              email: "nguyenvana@gmail.com"
            })
              .then((res) => {
                if (res.content.length > 0) {
                  const report: Report = res.content[res.content.length - 1];
                  let reportStatus: string;
                  if (report.status === EReportStatus.NEW) {
                    reportStatus = "Chưa xử lý";
                  } else if (report.status === EReportStatus.PROCESSING) {
                    reportStatus = "Đang xử lý";
                  } else {
                    reportStatus = "Đã xử lý";
                  }
                  location.reportStatus = reportStatus;
                }
                const feature: Feature = {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [location.longitude, location.latitude]
                  },
                  properties: {
                    ...location
                  }
                };
                if (location.planning) {
                  locationsIsPlanning.push(feature);
                } else {
                  locationsIsNotPlanning.push(feature);
                }
              })
              .catch((e) => {
                console.log(e);
              });
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getAllLocations();
  }, [locationsIsNotPlanning, locationsIsPlanning]);

  useEffect(() => {
    const getAllReportsTypeLocation = async () => {
      ReportService.getReports({
        reportTypeName: EReportType.LOCATION,
        pageSize: 999
      })
        .then((res) => {
          res.content.forEach((report: Report) => {
            let reportStatus: string;
            if (report.status === EReportStatus.NEW) {
              reportStatus = "Chưa xử lý";
            } else if (report.status === EReportStatus.PROCESSING) {
              reportStatus = "Đang xử lý";
            } else {
              reportStatus = "Đã xử lý";
            }
            const reportLocation: RandomLocation = {
              address: report.address as string,
              longitude: report.longitude as number,
              latitude: report.latitude as number,
              reportStatus: reportStatus
            };
            const feature: Feature = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [reportLocation.longitude, reportLocation.latitude]
              },
              properties: {
                ...reportLocation
              }
            };
            reportLocations.push(feature);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getAllReportsTypeLocation();
  }, [reportLocations]);

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

  const changeHandleReportLocation = () => {
    const currentMap = map.current;
    if (!currentMap) return;
    const visibility = currentMap.getLayoutProperty("report_location", "visibility");
    if (!visibility || visibility === "visible") {
      currentMap.setLayoutProperty("report_location", "visibility", "none");
      currentMap.setLayoutProperty("locations_is_not_planning", "text-field", "");
      currentMap.setLayoutProperty("locations_is_planning", "text-field", "");
    } else {
      currentMap.setLayoutProperty("report_location", "visibility", "visible");
      currentMap.setLayoutProperty("locations_is_not_planning", "text-field", [
        "get",
        "reportStatus"
      ]);
      currentMap.setLayoutProperty("locations_is_planning", "text-field", ["get", "reportStatus"]);
    }
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

  const loadLocationLayer = (
    imageUrl: string,
    imageName: string,
    sourceName: string,
    layerName: string,
    features: Feature[]
  ) => {
    if (!map.current) return;
    map.current.loadImage(imageUrl, (error, image) => {
      if (error) throw error;
      if (!map.current) return;
      map.current.addImage(imageName, image as HTMLImageElement);
      map.current.addSource(sourceName, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features
        }
      });

      map.current.addLayer({
        id: layerName,
        type: "symbol",
        source: sourceName,
        layout: {
          "icon-image": imageName,
          "text-field": ["get", "reportStatus"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.25],
          "text-size": 10,
          "text-anchor": "top"
        }
      });
      map.current.on("mouseenter", layerName, (e) => showPopup(e));
      map.current.on("mouseleave", layerName, () => {
        hidePopup();
      });

      map.current.on("click", layerName, (e) => {
        clickHandler(e, layerName);
      });
    });
  };
  useEffect(() => {
    const initMap = () => {
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
          loadLocationLayer(
            "https://i.ibb.co/5hWpBFR/icons8-circle-24-3.png",
            "marker_is_planning",
            "locations_is_planning",
            "locations_is_planning",
            locationsIsPlanning
          );
          loadLocationLayer(
            "https://i.ibb.co/LvJJcmX/icons8-circle-24-4.png",
            "marker_is_not_planning",
            "locations_is_not_planning",
            "locations_is_not_planning",
            locationsIsNotPlanning
          );
          map.current.loadImage(
            "https://i.ibb.co/Jmm2yS2/icons8-circle-24-5.png",
            (error, image) => {
              if (!map.current) return;
              map.current.addImage("marker-report-location", image as HTMLImageElement);
              map.current.addSource("report_location", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: reportLocations
                }
              });

              map.current.addLayer({
                id: "report_location",
                type: "symbol",
                source: "report_location",
                layout: {
                  "icon-image": "marker-report-location",
                  "text-field": ["get", "reportStatus"],
                  "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                  "text-offset": [0, 1.25],
                  "text-size": 10,
                  "text-anchor": "top"
                }
              });

              map.current.on("mouseenter", "report_location", (e) => {
                if (map.current) map.current.getCanvas().style.cursor = "pointer";
              });
              map.current.on("mouseleave", "report_location", () => {
                if (map.current) map.current.getCanvas().style.cursor = "";
              });

              map.current.on("click", "report_location", (e) => {
                const map = e.target;
                const features: MapGeoJSONFeature[] = map.queryRenderedFeatures(e.point, {
                  layers: ["report_location"]
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
            }
          );
          map.current.on("click", async (e) => {
            const map = e.target;
            const features = map.queryRenderedFeatures(e.point, {
              layers: ["locations_is_planning", "locations_is_not_planning", "report_location"]
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
        });
      }
    };
    initMap();
  }, [API_KEY, lng, lat, zoom]);

  return (
    <Box className={classes.mapWrap}>
      <Box className={classes.geocoding}>
        <GeocodingControl apiKey={API_KEY} language={"vi"} mapController={mapController} />
      </Box>
      <Box ref={mapContainer} className={classes.map}></Box>
      <Box className={classes.botNavbar}>
        <Box className={classes.botNavbarItem}>
          <Switch
            defaultChecked
            onChange={() => handleClickSwitchLocationEvent("locations_is_planning")}
          />
          <ParagraphSmall>Điểm đặt QC đã quy hoạch</ParagraphSmall>
        </Box>
        <Box className={classes.botNavbarItem}>
          <Switch
            defaultChecked
            onChange={() => handleClickSwitchLocationEvent("locations_is_not_planning")}
          />
          <ParagraphSmall>Điểm đặt QC chưa quy hoạch</ParagraphSmall>
        </Box>
        <Box className={classes.botNavbarItem}>
          <Switch defaultChecked onChange={changeHandleReportLocation} />
          <ParagraphSmall>Địa điểm báo cáo</ParagraphSmall>
        </Box>
        <Button
          variant='contained'
          color='primary'
          size='small'
          onClick={() => setOpenReportInfoPopup(true)}
        >
          Xem báo cáo
        </Button>
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
      <ReportInfoPopup open={openReportInfoPopup} setOpen={setOpenReportInfoPopup} />
    </Box>
  );
};

export default MapAdsManagement;
