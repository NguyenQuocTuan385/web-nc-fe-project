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
import { useSelector } from "react-redux";
import { RootState } from "store";
import { User } from "models/user";
import useIntercepts from "hooks/useIntercepts";
import { UseFormReset } from "react-hook-form";
import { EReportStatus, EReportType, EStatusGetReports, Report } from "models/report";
import ReportService from "services/report";

interface MapAdsManagementAdminProps {
  locationView?: Location;
  reset?: UseFormReset<any>;
  reportView?: Report;
}
enum ELocationCheckedSwitch {
  BOTH = 1,
  LOCATION_IS_PLANNING = 2,
  LOCATION_IS_NOT_PLANNING = 3,
  NOT_AT_ALL = 4
}
const MapAdsManagementAdmin = ({ locationView, reset, reportView }: MapAdsManagementAdminProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibre | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [zoom] = useState<number>(locationView ? 17 : 14);
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

  let locationsIsPlanningNoAdvertises = useRef<Feature[]>([]);
  let locationsIsPlanningHasAdvertises = useRef<Feature[]>([]);
  let locationsIsNotPlanningNoAdvertises = useRef<Feature[]>([]);
  let locationsIsNotPlanningHasAdvertises = useRef<Feature[]>([]);
  let clusters = useRef<Feature[]>([]);
  const [locationCheckedSwitch, setLocationCheckedSwitch] = useState<ELocationCheckedSwitch>(
    ELocationCheckedSwitch.BOTH
  );

  const user: User | null = useSelector((state: RootState) => state.auth.currentUser);

  const closeAdsSidebar = () => {
    setOpenLocationSidebar(false);
  };

  const closeAddressSidebar = () => {
    setOpenRandomLocationSidebar(false);
  };

  const intercept = useIntercepts();

  useEffect(() => {
    const getAllLocations = async () => {
      let res;
      if (user?.property?.id) {
        res = await LocationService.getLocationsByPropertyId(
          user.property.id,
          {
            pageSize: 9999
          },
          intercept
        );
      } else {
        res = await LocationService.getLocations({ pageSize: 9999 }, intercept);
      }
      const locations_temp: Location[] = res.content;
      if (lng === null && lat === null && locations_temp.length > 0) {
        if (!!locationView) {
          setLng(locationView.longitude);
          setLat(locationView.latitude);
        } else if (reportView) {
          if (reportView.reportTypeName === EReportType.LOCATION) {
            setLng(reportView.longitude as number);
            setLat(reportView.latitude as number);
          } else if (reportView.reportTypeName === EReportType.ADVERTISE) {
            setLng(reportView.advertise?.location.longitude as number);
            setLat(reportView.advertise?.location.latitude as number);
          }
        } else {
          setLng(locations_temp[0].longitude);
          setLat(locations_temp[0].latitude);
        }
      }

      const locationsIsPlanningNoAdvertisesTemp: Feature[] = [];
      const locationsIsPlanningHasAdvertisesTemp: Feature[] = [];
      const locationsIsNotPlanningNoAdvertisesTemp: Feature[] = [];
      const locationsIsNotPlanningHasAdvertisesTemp: Feature[] = [];

      await Promise.all(
        locations_temp.map(async (location: Location) => {
          ReportService.getReports(
            {
              locationId: location.id,
              pageSize: 999,
              status: EStatusGetReports.EXCEPT_SUCCESS
            },
            intercept
          )
            .then(async (res) => {
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
              const existsAdvertises = await LocationService.checkExistsAdvertises(
                location.id,
                intercept
              );
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
                  ? locationsIsPlanningHasAdvertisesTemp.push(feature)
                  : locationsIsPlanningNoAdvertisesTemp.push(feature);
              } else {
                existsAdvertises
                  ? locationsIsNotPlanningHasAdvertisesTemp.push(feature)
                  : locationsIsNotPlanningNoAdvertisesTemp.push(feature);
              }
            })
            .catch((error) => {});
        })
      );
      locationsIsPlanningNoAdvertises.current = locationsIsPlanningNoAdvertisesTemp;
      locationsIsPlanningHasAdvertises.current = locationsIsPlanningHasAdvertisesTemp;
      locationsIsNotPlanningNoAdvertises.current = locationsIsNotPlanningNoAdvertisesTemp;
      locationsIsNotPlanningHasAdvertises.current = locationsIsNotPlanningHasAdvertisesTemp;
    };
    getAllLocations();
  }, [
    locationsIsPlanningHasAdvertises,
    locationsIsPlanningNoAdvertises,
    locationsIsNotPlanningHasAdvertises,
    locationsIsNotPlanningNoAdvertises
  ]);

  const changeSourceDataLocation = (locationCheckedChange: ELocationCheckedSwitch) => {
    if (locationCheckedChange === ELocationCheckedSwitch.BOTH) {
      clusters.current = locationsIsNotPlanningHasAdvertises.current.concat(
        locationsIsNotPlanningNoAdvertises.current,
        locationsIsPlanningHasAdvertises.current,
        locationsIsPlanningNoAdvertises.current
      );
    } else if (locationCheckedChange === ELocationCheckedSwitch.LOCATION_IS_PLANNING) {
      clusters.current = locationsIsPlanningHasAdvertises.current.concat(
        locationsIsPlanningNoAdvertises.current
      );
    } else if (locationCheckedChange === ELocationCheckedSwitch.LOCATION_IS_NOT_PLANNING) {
      clusters.current = locationsIsNotPlanningHasAdvertises.current.concat(
        locationsIsNotPlanningNoAdvertises.current
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

        clusters.current = locationsIsNotPlanningHasAdvertises.current.concat(
          locationsIsNotPlanningNoAdvertises.current,
          locationsIsPlanningHasAdvertises.current,
          locationsIsPlanningNoAdvertises.current
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

        map.current.loadImage("https://i.ibb.co/5hWpBFR/icons8-circle-24-3.png", (error, image) => {
          if (error) throw error;
          if (!map.current) return;
          map.current.addImage("imageName1", image as HTMLImageElement);
          map.current.addLayer({
            id: "unclustered_location_is_planning_no_advertises",
            type: "symbol",
            source: "locations",
            filter: [
              "all",
              ["!has", "point_count"],
              ["==", "planning", true],
              ["==", "existsAdvertises", false]
            ],
            layout: {
              "icon-image": "imageName1",
              "text-field": ["get", "reportStatus"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-size": 10,
              "text-anchor": "top"
            }
          });
        });

        loadLocationLayerFunction("unclustered_location_is_planning_no_advertises");

        map.current.loadImage("https://i.ibb.co/BPbcShD/icons8-circle-24-7.png", (error, image) => {
          if (error) throw error;
          if (!map.current) return;
          map.current.addImage("imageName2", image as HTMLImageElement);
          map.current.addLayer({
            id: "unclustered_location_is_planning_has_advertises",
            type: "symbol",
            source: "locations",
            filter: [
              "all",
              ["!has", "point_count"],
              ["==", "planning", true],
              ["==", "existsAdvertises", true]
            ],
            layout: {
              "icon-image": "imageName2",
              "text-field": ["get", "reportStatus"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-size": 10,
              "text-anchor": "top"
            }
          });
        });

        loadLocationLayerFunction("unclustered_location_is_planning_has_advertises");

        map.current.loadImage("https://i.ibb.co/LvJJcmX/icons8-circle-24-4.png", (error, image) => {
          if (error) throw error;
          if (!map.current) return;
          map.current.addImage("imageName3", image as HTMLImageElement);
          map.current.addLayer({
            id: "unclustered_location_is_not_planning_has_advertises",
            type: "symbol",
            source: "locations",
            filter: [
              "all",
              ["!has", "point_count"],
              ["==", "planning", false],
              ["==", "existsAdvertises", true]
            ],
            layout: {
              "icon-image": "imageName3",
              "text-field": ["get", "reportStatus"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-size": 10,
              "text-anchor": "top"
            }
          });
        });

        loadLocationLayerFunction("unclustered_location_is_not_planning_has_advertises");

        map.current.loadImage("https://i.ibb.co/JyWgyYt/icons8-circle-24-6.png", (error, image) => {
          if (error) throw error;
          if (!map.current) return;
          map.current.addImage("marker_is_not_planning_not_advertises", image as HTMLImageElement);
          map.current.addLayer({
            id: "unclustered_location_is_not_planning_no_advertises",
            type: "symbol",
            source: "locations",
            filter: [
              "all",
              ["!has", "point_count"],
              ["==", "planning", false],
              ["==", "existsAdvertises", false]
            ],
            layout: {
              "icon-image": "marker_is_not_planning_not_advertises",
              "text-field": ["get", "reportStatus"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-size": 10,
              "text-anchor": "top"
            }
          });
        });

        loadLocationLayerFunction("unclustered_location_is_not_planning_no_advertises");

        if (locationView) {
          map.current.loadImage(
            "https://i.ibb.co/XDTztCq/icons8-location-48.png",
            (error, image) => {
              if (error) throw error;
              if (!map.current) return;
              map.current.addImage("marker_location_view", image as HTMLImageElement);
              map.current.addLayer({
                id: "location_view",
                type: "symbol",
                source: "locations",
                filter: ["all", ["!has", "point_count"], ["==", "id", locationView.id]],
                layout: {
                  "icon-image": "marker_location_view"
                }
              });
            }
          );
          loadLocationLayerFunction("location_view");
        } else if (reportView) {
          let reportFeature: Feature;
          if (reportView.reportTypeName === EReportType.LOCATION) {
            const randomLocationReport: RandomLocation = {
              address: reportView.address as string,
              longitude: reportView.longitude as number,
              latitude: reportView.latitude as number
            };
            reportFeature = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [reportView.longitude as number, reportView.latitude as number]
              },
              properties: randomLocationReport
            };
            map.current.addSource("report_view", {
              type: "geojson",
              data: reportFeature
            });
            map.current.loadImage(
              "https://i.ibb.co/XDTztCq/icons8-location-48.png",
              (error, image) => {
                if (error) throw error;
                if (!map.current) return;
                map.current.addImage("marker_report_view", image as HTMLImageElement);
                map.current.addLayer({
                  id: "report_view",
                  type: "symbol",
                  source: "report_view",
                  layout: {
                    "icon-image": "marker_report_view"
                  }
                });
              }
            );
            map.current.on("mouseenter", "report_view", (e) => {
              if (map.current) map.current.getCanvas().style.cursor = "pointer";
            });
            map.current.on("mouseleave", "report_view", () => {
              if (map.current) map.current.getCanvas().style.cursor = "";
            });

            map.current.on("click", "report_view", (e) => {
              const map = e.target;
              const features: MapGeoJSONFeature[] = map.queryRenderedFeatures(e.point, {
                layers: ["report_view"]
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
          } else if (reportView.reportTypeName === EReportType.ADVERTISE) {
            reportFeature = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  reportView.advertise?.location.longitude as number,
                  reportView.advertise?.location.latitude as number
                ]
              },
              properties: reportView.advertise?.location as Location
            };
            map.current.addSource("report_view", {
              type: "geojson",
              data: reportFeature
            });
            map.current.loadImage(
              "https://i.ibb.co/XDTztCq/icons8-location-48.png",
              (error, image) => {
                if (error) throw error;
                if (!map.current) return;
                map.current.addImage("marker_report_view", image as HTMLImageElement);
                map.current.addLayer({
                  id: "report_view",
                  type: "symbol",
                  source: "report_view",
                  layout: {
                    "icon-image": "marker_report_view"
                  }
                });
              }
            );
            loadLocationLayerFunction("report_view");
          }
        }
        map.current.on("click", async (e) => {
          const map = e.target;
          const layersQuery: string[] = [
            "unclustered_location_is_not_planning_has_advertises",
            "unclustered_location_is_not_planning_no_advertises",
            "unclustered_location_is_planning_has_advertises",
            "unclustered_location_is_planning_no_advertises",
            "clusters",
            "cluster-count"
          ];
          if (map.getLayer("report_view")) {
            layersQuery.push("report_view");
          }
          if (map.getLayer("location_view")) {
            layersQuery.push("location_view");
          }
          const features: any = map.queryRenderedFeatures(e.point, {
            layers: layersQuery
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
              if (reset) {
                reset({
                  address: place_name_vi,
                  longitude: lng,
                  latitude: lat
                });
              }
              setRandomLocationData(randomLocationTemp);
            } else {
              const { place_name_vi } = results.features[0];
              const coordinates = results.features[0].geometry.coordinates.slice();
              const randomLocationTemp: RandomLocation = {
                address: place_name_vi,
                longitude: coordinates[0],
                latitude: coordinates[1]
              };
              if (reset) {
                reset({
                  address: place_name_vi,
                  longitude: coordinates[0],
                  latitude: coordinates[1]
                });
              }
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
        <GeocodingControl
          apiKey={API_KEY}
          language={"vi"}
          mapController={mapController}
          placeholder='Tìm kiếm địa điểm'
          noResultsMessage='Xin lỗi, chúng tôi không tìm thấy địa điểm bạn cần tìm kiếm'
          onResponse={(detail: any) => {
            if (!detail) return;
            if (reset) {
              reset({
                address: detail.featureCollection.features[0].place_name_vi,
                longitude: detail.featureCollection.features[0].center[0],
                latitude: detail.featureCollection.features[0].center[1]
              });
            }
          }}
        />
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
