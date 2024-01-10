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

export default function EditAdTableLicenseDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const advertiseId = location.pathname.split("/").pop();
  const [advertise, setAdvertiseDetail] = useState<Advertise | null>(null);
  useEffect(() => {
    const getAdvertiseById = async () => {
      AdvertiseService.getAdvertisesById(Number(advertiseId))
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
  function formatDateToDDMMYYYY(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    };
    return new Date(date).toLocaleDateString("en-GB", options);
  }

  const deleteAdvertiseEdit = async (id: number) => {
    await AdvertiseService.deleteAdvertiseEditById(id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateStatus = async (id: number, updateStatus: UpdateStatus) => {
    await AdvertiseService.updateStatus(id, updateStatus)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClickAccept = async (event: React.MouseEvent, data: Advertise) => {
    event.stopPropagation();
    const updateAdvertise = async (data: Advertise) => {
      await AdvertiseService.updateAdvertise(data.id, {
        licensing: data.licensing,
        width: data.advertiseEdit?.width!!,
        height: data.advertiseEdit?.height!!,
        images: data.advertiseEdit?.images!!,
        locationId: data.advertiseEdit?.location.id!!,
        adsTypeId: data.advertiseEdit?.adsType.id!!,
        pillarQuantity: data.pillarQuantity!!
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    await updateAdvertise(data);
    await deleteAdvertiseEdit(data.advertiseEdit?.id!!);
    navigate(-1);
  };

  const handleClickCancel = async (event: React.MouseEvent, data: Advertise) => {
    event.stopPropagation();
    await updateStatus(data.id, {
      status: false
    });
    await deleteAdvertiseEdit(data.advertiseEdit?.id!!);
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
                <img
                  src='https://pano.vn/wp-content/uploads/2019/01/billboard-quang-cao-ngoai-troi-1-1062x800.jpg'
                  alt=''
                  className={classes.image}
                />
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
                  {advertise?.pillarQuantity} {" trụ/bảng"}
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
                <img
                  src='https://pano.vn/wp-content/uploads/2019/01/billboard-quang-cao-ngoai-troi-1-1062x800.jpg'
                  alt=''
                  className={classes.image}
                />
              </Box>
              <Box className={classes.infoContainer}>
                <Heading3>Thông tin bảng</Heading3>
                <ParagraphBody className={classes.infoContent}>
                  {renderEdit(advertise?.adsType.name!!, advertise?.advertiseEdit?.adsType.name!!)}
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
                  {advertise?.pillarQuantity} {" trụ/bảng"}
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
                    formatDateToDDMMYYYY(advertise?.advertiseEdit?.createdAt)}
                </span>
              </ParagraphBody>
              <Box>
                <ParagraphBody className={classes.infoContent}>
                  Lí do chỉnh sửa:&nbsp;
                  <span>{advertise?.advertiseEdit?.content}</span>
                </ParagraphBody>
                <Box></Box>
              </Box>
            </Box>

            <Box className={classes.actionButtons}>
              <Button
                className={classes.approveButton}
                variant='contained'
                color='primary'
                onClick={(e) => handleClickAccept(e, advertise!!)}
              >
                Duyệt
              </Button>
              <Button
                className={classes.skipButton}
                variant='contained'
                color='error'
                onClick={(e) => handleClickCancel(e, advertise!!)}
              >
                Bỏ qua
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  // Remove the closing </Box> tag
}
