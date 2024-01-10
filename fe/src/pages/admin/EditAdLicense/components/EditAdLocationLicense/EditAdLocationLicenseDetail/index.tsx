import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ParagraphBody from "components/common/text/ParagraphBody";
import Button from "@mui/material/Button";
import SouthIcon from "@mui/icons-material/South";
import { useLocation, useNavigate } from "react-router-dom";
import Heading3 from "components/common/text/Heading3";
import SidebarDCMS from "components/admin/SidebarDCMS";
import LocationService from "services/location";
import { Location, updateStatus } from "models/location";
import useIntercepts from "hooks/useIntercepts";

export default function EditAdLocationLicenseDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationId = location.pathname.split("/").pop();
  const [locationDetail, setLocationDetail] = useState<Location | null>(null);
  const intercept = useIntercepts();

  useEffect(() => {
    const getLocationById = async () => {
      LocationService.getLocationsById(Number(locationId), intercept)
        .then((res) => {
          setLocationDetail(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getLocationById();
  }, []);
  function formatDateToDDMMYYYY(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    };
    return new Date(date).toLocaleDateString("en-GB", options);
  }

  // const { address, timeEdit, planning, adsType, position, edit, reason } = location.state;
  const renderCurrent = (current: string, edit: string) => {
    if (current === edit) {
      return <span>{current}</span>;
    } else {
      return <span className={classes.error}>{current}</span>;
    }
  };
  const renderEdit = (current: string, edit: string) => {
    if (current === edit) {
      return <span>{edit}</span>;
    } else {
      return <span className={classes.edit}>{edit}</span>;
    }
  };

  const deleteLocationEdit = async (id: number) => {
    await LocationService.deleteLocationEditById(id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateStatus = async (id: number, updateStatus: updateStatus) => {
    await LocationService.updateStatus(id, updateStatus)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClickAccept = async (event: React.MouseEvent, data: Location) => {
    event.stopPropagation();
    const updateLocation = async (data: Location) => {
      await LocationService.updateLocationsById(data.id, {
        planning: data.locationEdit?.planning!!,
        latitude: data.locationEdit?.latitude!!,
        longitude: data.locationEdit?.longitude!!,
        address: data.locationEdit?.address!!,
        advertiseFormId: data.locationEdit?.adsForm.id!!,
        locationTypeId: data.locationEdit?.locationType.id!!,
        propertyId: data.locationEdit?.property.id!!,
        imageUrls: data.locationEdit?.images!!
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    await updateLocation(data);
    await deleteLocationEdit(data.locationEdit?.id!!);
    navigate(-1);
  };

  const handleClickCancel = async (event: React.MouseEvent, data: Location) => {
    event.stopPropagation();
    await updateStatus(data.id, {
      status: false
    });
    await deleteLocationEdit(data.locationEdit?.id!!);
    navigate(-1);
  };

  return (
    <Box className={classes.boxContainer}>
      <SidebarDCMS />
      <Box className={classes.boxContent}>
        <Box className={classes.backPage} onClick={() => navigate(-1)}>
          <ArrowBackIcon className={classes.iconBack} />
          Trở về
        </Box>
        <Box className={classes.boxContentDetail}>
          <Box className={classes.boxCurrentContent}>
            <Box className={classes.boxTitle}>
              <ParagraphBody fontWeight={"bold"}>TRƯỚC KHI THAY ĐỔI</ParagraphBody>
            </Box>
            <Box className={classes.imageInfoContainer}>
              <Box className={classes.imageContainer}>
                <img src={locationDetail?.images} alt='' className={classes.image} />
              </Box>
              <Box className={classes.infoContainer}>
                <Heading3>Điểm đặt quảng cáo</Heading3>

                <ParagraphBody className={classes.infoContent}>
                  Địa chỉ:&nbsp;
                  {renderCurrent(
                    locationDetail?.address || "",
                    locationDetail?.locationEdit?.address || ""
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Loại vị trí:&nbsp;
                  {renderCurrent(
                    locationDetail?.locationType.name || "",
                    locationDetail?.locationEdit?.locationType.name || ""
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Hình thức quảng cáo:&nbsp;
                  {renderCurrent(
                    locationDetail?.adsForm.name || "",
                    locationDetail?.locationEdit?.adsForm.name || ""
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  {renderCurrent(
                    locationDetail?.planning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH",
                    locationDetail?.locationEdit?.planning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
                  )}
                </ParagraphBody>
              </Box>
            </Box>
          </Box>
          <Box className={classes.boxArrow}>
            <SouthIcon className={classes.iconArrow} />
          </Box>
          <Box className={classes.boxHistoryContent}>
            <Box className={classes.boxTitle}>
              <ParagraphBody fontWeight={"bold"}>SAU KHI THAY ĐỔI</ParagraphBody>
            </Box>
            <Box className={classes.imageInfoContainer}>
              <Box className={classes.imageContainer}>
                <img src={locationDetail?.locationEdit?.images} alt='' className={classes.image} />
              </Box>
              <Box className={classes.infoContainer}>
                <Heading3>Điểm đặt quảng cáo</Heading3>

                <ParagraphBody className={classes.infoContent}>
                  Địa chỉ:&nbsp;
                  {renderEdit(
                    locationDetail?.address || "",
                    locationDetail?.locationEdit?.address || ""
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Loại vị trí:&nbsp;
                  {renderEdit(
                    locationDetail?.locationType.name || "",
                    locationDetail?.locationEdit?.locationType.name || ""
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Hình thức quảng cáo:&nbsp;
                  {renderEdit(
                    locationDetail?.adsForm.name || "",
                    locationDetail?.locationEdit?.adsForm.name || ""
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  {renderEdit(
                    locationDetail?.planning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH",
                    locationDetail?.locationEdit?.planning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"
                  )}
                </ParagraphBody>
              </Box>
            </Box>
          </Box>
          <Box className={classes.boxMapContainer}>
            <Box className={classes.boxTitle}>
              <ParagraphBody fontWeight={"bold"}>VỊ TRÍ TRÊN BẢN ĐỒ</ParagraphBody>
            </Box>
            <Box className={classes.boxMap}>
              <img
                src='https://meeymap.com/tin-tuc/wp-content/uploads/2023/06/0-20220914141738669.jpg'
                alt=''
                width={"100%"}
                height={"400px"}
              />
            </Box>
            <Box className={classes.editHistoryContainer}>
              <Box className={classes.editInfo}>
                <ParagraphBody className={classes.infoContent}>
                  Thời điểm chỉnh sửa:&nbsp;
                  <span>
                    {locationDetail?.locationEdit?.createdAt &&
                      formatDateToDDMMYYYY(locationDetail?.locationEdit?.createdAt)}
                  </span>
                </ParagraphBody>
                <Box>
                  <ParagraphBody className={classes.infoContent}>
                    Lí do chỉnh sửa:&nbsp;
                    <span>{locationDetail?.locationEdit?.content}</span>
                  </ParagraphBody>
                  <Box></Box>
                </Box>
              </Box>

              <Box className={classes.actionButtons}>
                <Button
                  className={classes.approveButton}
                  variant='contained'
                  color='primary'
                  onClick={(e) => handleClickAccept(e, locationDetail as Location)}
                >
                  Duyệt
                </Button>
                <Button
                  className={classes.skipButton}
                  variant='contained'
                  color='error'
                  onClick={(e) => handleClickCancel(e, locationDetail as Location)}
                >
                  Bỏ qua
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
