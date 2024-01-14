import React from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ParagraphBody from "components/common/text/ParagraphBody";
import Button from "@mui/material/Button";
import SouthIcon from "@mui/icons-material/South";
import { useLocation, useNavigate } from "react-router-dom";
import Heading3 from "components/common/text/Heading3";
import SidebarDCMS from "components/admin/SidebarDCMS";
import { useEffect, useState } from "react";
import { Advertise, UpdateStatus } from "models/advertise";
import AdvertiseService from "services/advertise";
import useIntercepts from "hooks/useIntercepts";
import { DateHelper } from "helpers/date";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { set } from "react-hook-form";
import Editor from "components/common/Editor/EditWithQuill";

export default function EditAdTableLicenseDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const advertiseId = location.pathname.split("/").pop();
  const [advertise, setAdvertiseDetail] = useState<Advertise | null>(null);
  const intercept = useIntercepts();
  const [openAccept, setOpenAccept] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);
  const handleClose = () => {
    setOpenAccept(false);
    setOpenCancel(false);
  };
  useEffect(() => {
    const getAdvertiseById = async () => {
      AdvertiseService.getAdvertisesById(Number(advertiseId), intercept)
        .then((res) => {
          setAdvertiseDetail(res);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAdvertiseById();
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

  const deleteAdvertiseEdit = async (id: number) => {
    await AdvertiseService.deleteAdvertiseEditById(id, intercept)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateStatus = async (id: number, updateStatus: UpdateStatus) => {
    await AdvertiseService.updateStatus(id, updateStatus, intercept)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const confirmAccept = async () => {
    const updateAdvertise = async () => {
      await AdvertiseService.updateAdvertise(
        advertise?.id!!,
        {
          licensing: advertise?.licensing!!,
          width: advertise?.advertiseEdit?.width!!,
          height: advertise?.advertiseEdit?.height!!,
          images: advertise?.advertiseEdit?.images!!,
          locationId: advertise?.advertiseEdit?.location.id!!,
          adsTypeId: advertise?.advertiseEdit?.adsType.id!!,
          pillarQuantity: advertise?.advertiseEdit?.pillarQuantity!!
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
    await updateAdvertise();
    await deleteAdvertiseEdit(advertise?.advertiseEdit?.id!!);
    setOpenAccept(false);
    navigate(-1);
  };

  const handleClickAccept = () => {
    setOpenAccept(true);
  };

  const confirmCancel = async () => {
    await updateStatus(advertise?.id!!, {
      statusEdit: false
    });
    await deleteAdvertiseEdit(advertise?.advertiseEdit?.id!!);
    setOpenCancel(false);
    navigate(-1);
  };
  const handleClickCancel = () => {
    setOpenCancel(true);
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
              <Box className={classes.imageInfoContainer}>
                <Box className={classes.imageContainer}>
                  <img src={advertise?.images!!} alt='' className={classes.image} />
                </Box>
                <Box className={classes.infoContainer}>
                  <Heading3>Thông tin bảng</Heading3>

                  <ParagraphBody className={classes.infoContent}>
                    {renderCurrent(
                      advertise?.adsType.name!!,
                      advertise?.advertiseEdit?.adsType.name!!
                    )}
                  </ParagraphBody>
                  <ParagraphBody className={classes.infoContent}>
                    {renderCurrent(
                      advertise?.location.address!!,
                      advertise?.advertiseEdit?.location.address!!
                    )}
                  </ParagraphBody>
                  <ParagraphBody className={classes.infoContent}>
                    Kích thước:&nbsp;
                    {renderCurrent(
                      advertise?.width.toString()!!,
                      advertise?.advertiseEdit?.width.toString()!!
                    )}{" "}
                    <span>x</span>{" "}
                    {renderCurrent(
                      advertise?.height.toString()!!,
                      advertise?.advertiseEdit?.height.toString()!!
                    )}{" "}
                  </ParagraphBody>
                  <ParagraphBody className={classes.infoContent}>
                    Số lượng:&nbsp;
                    {renderCurrent(
                      advertise?.pillarQuantity?.toString()!!,
                      advertise?.advertiseEdit?.pillarQuantity?.toString()!!
                    )}{" "}
                    {" trụ/bảng"}
                  </ParagraphBody>
                  <ParagraphBody className={classes.infoContent}>
                    Hình thức:&nbsp;
                    {renderCurrent(
                      advertise?.location.adsForm.name!!,
                      advertise?.advertiseEdit?.location.adsForm.name!!
                    )}
                  </ParagraphBody>
                  <ParagraphBody className={classes.infoContent}>
                    Phân loại:&nbsp;
                    {renderCurrent(
                      advertise?.location.locationType.name!!,
                      advertise?.advertiseEdit?.location.locationType.name!!
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
                  <img src={advertise?.advertiseEdit?.images!!} alt='' className={classes.image} />
                </Box>
                <Box className={classes.infoContainer}>
                  <Heading3>Thông tin bảng</Heading3>
                  <ParagraphBody className={classes.infoContent}>
                    {renderEdit(
                      advertise?.adsType.name!!,
                      advertise?.advertiseEdit?.adsType.name!!
                    )}
                  </ParagraphBody>
                  <ParagraphBody className={classes.infoContent}>
                    {renderEdit(
                      advertise?.location.address!!,
                      advertise?.advertiseEdit?.location.address!!
                    )}
                  </ParagraphBody>
                  <ParagraphBody className={classes.infoContent}>
                    Kích thước:&nbsp;
                    {renderEdit(
                      advertise?.width.toString()!!,
                      advertise?.advertiseEdit?.width.toString()!!
                    )}
                    <span>x</span>{" "}
                    {renderEdit(
                      advertise?.height.toString()!!,
                      advertise?.advertiseEdit?.height.toString()!!
                    )}
                  </ParagraphBody>
                  <ParagraphBody className={classes.infoContent}>
                    Số lượng:&nbsp;
                    {renderEdit(
                      advertise?.pillarQuantity?.toString()!!,
                      advertise?.advertiseEdit?.pillarQuantity.toString()!!
                    )}{" "}
                    {" trụ/bảng"}
                  </ParagraphBody>
                  <ParagraphBody className={classes.infoContent}>
                    Hình thức:&nbsp;
                    {renderEdit(
                      advertise?.location.adsForm.name!!,
                      advertise?.advertiseEdit?.location.adsForm.name!!
                    )}
                  </ParagraphBody>
                  <ParagraphBody className={classes.infoContent}>
                    Phân loại:&nbsp;
                    {renderEdit(
                      advertise?.location.locationType.name!!,
                      advertise?.advertiseEdit?.location.locationType.name!!
                    )}
                  </ParagraphBody>
                </Box>
              </Box>
            </Box>
            <Box className={classes.editHistoryContainer}>
              <Box className={classes.editInfo}>
                <ParagraphBody className={classes.infoContent}>
                  Thời điểm chỉnh sửa:&nbsp;
                  <span>
                    {advertise?.advertiseEdit?.createdAt &&
                      DateHelper.formatDateToDDMMYYYY(advertise?.advertiseEdit?.createdAt)}
                  </span>
                </ParagraphBody>
                <Box>
                  <ParagraphBody className={classes.infoContent}>
                    Lí do chỉnh sửa:&nbsp;
                    <Editor
                      placeholder=''
                      isAllowedType={false}
                      content={advertise?.advertiseEdit?.content || "Không có nội dung báo cáo"}
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
      </SidebarDCMS>
      <Dialog
        open={openAccept}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Cấp phép chỉnh sửa bảng quảng cáo</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn muốn cấp phép chỉnh sửa bảng quảng cáo này ?
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
        <DialogTitle id='alert-dialog-title'>Cấp phép chỉnh sửa bảng quảng cáo</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn muốn hủy chỉnh sửa bảng quảng cáo này ?
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
  // Remove the closing </Box> tag
}
