import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ParagraphBody from "components/common/text/ParagraphBody";
import SouthIcon from "@mui/icons-material/South";
import { useLocation, useNavigate } from "react-router-dom";
import Heading3 from "components/common/text/Heading3";
import SidebarDCMS from "components/admin/SidebarDCMS";
import LocationService from "services/location";
import { Location, updateStatus } from "models/location";
import useIntercepts from "hooks/useIntercepts";
import { DateHelper } from "helpers/date";
import Grid from "@mui/material/Grid";
import SlideShowImages from "components/common/SlideShowImages";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Editor from "components/common/Editor/EditWithQuill";
export default function EditAdLocationLicenseDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationId = location.pathname.split("/").pop();
  const [locationDetail, setLocationDetail] = useState<Location | null>(null);
  const [imagesLocation, setImagesLocation] = useState<string[]>([]);
  const [imagesLocationEdit, setImagesLocationEdit] = useState<string[]>([]);
  const intercept = useIntercepts();
  const [openAccept, setopenAccept] = useState(false);
  const [openCancel, setopenCancel] = useState(false);
  const handleClose = () => {
    setopenAccept(false);
    setopenCancel(false);
  };

  useEffect(() => {
    const getLocationById = async () => {
      LocationService.getLocationsById(Number(locationId), intercept)
        .then((res) => {
          setLocationDetail(res);
          setImagesLocation(JSON.parse(res.images));
          setImagesLocationEdit(JSON.parse(res.locationEdit?.images!!));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getLocationById();
  }, []);

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
    await LocationService.deleteLocationEditById(id, intercept)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateStatus = async (id: number, updateStatus: updateStatus) => {
    await LocationService.updateStatus(id, updateStatus, intercept)
      .then((res) => {
        console.log(res);
        console.log("update status success");
      })
      .catch((err) => {
        console.log(err);
        console.log("update status fail");
      });
  };
  const confirmAccept = async () => {
    const updateLocation = async () => {
      await LocationService.updateLocationsById(
        locationDetail?.id!!,
        {
          planning: locationDetail?.locationEdit?.planning!!,
          latitude: locationDetail?.locationEdit?.latitude!!,
          longitude: locationDetail?.locationEdit?.longitude!!,
          address: locationDetail?.locationEdit?.address!!,
          advertiseFormId: locationDetail?.locationEdit?.adsForm.id!!,
          locationTypeId: locationDetail?.locationEdit?.locationType.id!!,
          propertyId: locationDetail?.locationEdit?.property.id!!,
          imageUrls: locationDetail?.locationEdit?.images!!
        },
        intercept
      )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    await updateLocation();
    await deleteLocationEdit(locationDetail?.locationEdit?.id!!);
    navigate(-1);
    setopenAccept(false);
  };
  const handleClickAccept = () => {
    setopenAccept(true);
  };

  const confirmCancel = async () => {
    await updateStatus(locationDetail?.id!!, {
      statusEdit: false
    });
    await deleteLocationEdit(locationDetail?.locationEdit?.id!!);
    navigate(-1);
    setopenCancel(false);
  };

  const handleClickCancel = () => {
    setopenCancel(true);
  };

  return (
    <Box className={classes.boxContainer}>
      <SidebarDCMS>
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
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <SlideShowImages images={imagesLocation} />
                </Grid>
                <Grid item xs={6}>
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
                </Grid>
              </Grid>
            </Box>
            <Box className={classes.boxArrow}>
              <SouthIcon className={classes.iconArrow} />
            </Box>
            <Box className={classes.boxHistoryContent}>
              <Box className={classes.boxTitle}>
                <ParagraphBody fontWeight={"bold"}>SAU KHI THAY ĐỔI</ParagraphBody>
              </Box>
              <Grid container spacing={3}>
                {imagesLocationEdit && imagesLocationEdit.length > 0 && (
                  <Grid item xs={6}>
                    <SlideShowImages images={imagesLocationEdit} />
                  </Grid>
                )}

                <Grid item xs={6}>
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
                </Grid>
              </Grid>
            </Box>
            <Box className={classes.boxMapContainer}>
              <Box className={classes.editHistoryContainer}>
                <Box className={classes.editInfo}>
                  <ParagraphBody className={classes.infoContent}>
                    Thời điểm chỉnh sửa:&nbsp;
                    <span>
                      {locationDetail?.locationEdit?.updatedAt &&
                        DateHelper.formatDateToDDMMYYYY(locationDetail?.locationEdit?.updatedAt)}
                    </span>
                  </ParagraphBody>
                  <Box>
                    <ParagraphBody className={classes.infoContent}>
                      Lí do chỉnh sửa:&nbsp;
                      <Editor
                        placeholder=''
                        isAllowedType={false}
                        content={
                          locationDetail?.locationEdit?.content || "Không có nội dung báo cáo"
                        }
                      />
                    </ParagraphBody>
                    <Box></Box>
                  </Box>
                </Box>

                <Box className={classes.actionButtons}>
                  <Button
                    className={classes.approveButton}
                    variant='contained'
                    color='primary'
                    onClick={handleClickAccept}
                  >
                    Duyệt
                  </Button>
                  <Button
                    className={classes.skipButton}
                    variant='contained'
                    color='error'
                    onClick={handleClickCancel}
                  >
                    Bỏ qua
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </SidebarDCMS>
      <Dialog
        open={openAccept}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Cấp phép chỉnh sửa địa điểm</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn muốn cấp phép chỉnh sửa địa điểm này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={confirmAccept} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCancel}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Cấp phép chỉnh sửa địa điểm</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn muốn hủy chỉnh sửa địa điểm này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={confirmCancel} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
