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

export default function EditAdLocationLicenseDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    id,
    address,
    timeEdit,
    planning,
    imgUrl,
    adsType,
    position,
    edit,
    reason,
  } = location.state;
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
              <ParagraphBody $fontWeight={"bold"}>
                TRƯỚC KHI THAY ĐỔI
              </ParagraphBody>
            </Box>
            <Box className={classes.imageInfoContainer}>
              <Box className={classes.imageContainer}>
                <img
                  src="https://pano.vn/wp-content/uploads/2019/01/billboard-quang-cao-ngoai-troi-1-1062x800.jpg"
                  alt="image"
                  className={classes.image}
                />
              </Box>
              <Box className={classes.infoContainer}>
                <Heading3>Điểm đặt quảng cáo</Heading3>

                <ParagraphBody className={classes.infoContent}>
                  Địa chỉ:&nbsp;
                  {address === edit.address ? (
                    <span>{address}</span>
                  ) : (
                    <span className={classes.error}>{address}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Loại vị trí:&nbsp;
                  {position === edit.location ? (
                    <span>{position}</span>
                  ) : (
                    <span className={classes.error}>{position}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Hình thức quảng cáo:&nbsp;
                  {adsType === edit.adsType ? (
                    <span>{adsType}</span>
                  ) : (
                    <span className={classes.error}>{adsType}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  {planning === edit.planning ? (
                    <span>{planning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"}</span>
                  ) : (
                    <span className={classes.error}>
                      {planning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"}
                    </span>
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
              <ParagraphBody $fontWeight={"bold"}>
                SAU KHI THAY ĐỔI
              </ParagraphBody>
            </Box>
            <Box className={classes.imageInfoContainer}>
              <Box className={classes.imageContainer}>
                <img
                  src="https://pano.vn/wp-content/uploads/2019/01/billboard-quang-cao-ngoai-troi-1-1062x800.jpg"
                  alt="image"
                  className={classes.image}
                />
              </Box>
              <Box className={classes.infoContainer}>
                <Heading3>Điểm đặt quảng cáo</Heading3>

                <ParagraphBody className={classes.infoContent}>
                  Địa chỉ:&nbsp;
                  {address === edit.address ? (
                    <span>{address}</span>
                  ) : (
                    <span className={classes.edit}>{edit.address}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Loại vị trí:&nbsp;
                  {position === edit.location ? (
                    <span>{position}</span>
                  ) : (
                    <span className={classes.edit}>{edit.location}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Hình thức quảng cáo:&nbsp;
                  {adsType === edit.adsType ? (
                    <span>{adsType}</span>
                  ) : (
                    <span className={classes.edit}>{edit.adsType}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  {planning === edit.planning ? (
                    <span>
                      {edit.planning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"}
                    </span>
                  ) : (
                    <span className={classes.edit}>
                      {edit.planning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"}
                    </span>
                  )}
                </ParagraphBody>
              </Box>
            </Box>
          </Box>
          <Box className={classes.boxMapContainer}>
            <Box className={classes.boxTitle}>
              <ParagraphBody $fontWeight={"bold"}>
                VỊ TRÍ TRÊN BẢN ĐỒ
              </ParagraphBody>
            </Box>
            <Box className={classes.boxMap}>
              <img
                src="https://meeymap.com/tin-tuc/wp-content/uploads/2023/06/0-20220914141738669.jpg"
                alt="image"
                width={"100%"}
                height={"400px"}
              />
            </Box>
            <Box className={classes.editHistoryContainer}>
              <Box className={classes.editInfo}>
                <ParagraphBody className={classes.infoContent}>
                  Thời điểm chỉnh sửa:&nbsp;
                  <span>{timeEdit}</span>
                </ParagraphBody>
                <Box>
                  <ParagraphBody className={classes.infoContent}>
                    Lí do chỉnh sửa:&nbsp;
                    <span>{reason}</span>
                  </ParagraphBody>
                  <Box></Box>
                </Box>
              </Box>

              <Box className={classes.actionButtons}>
                <Button
                  className={classes.approveButton}
                  variant="contained"
                  color="primary"
                >
                  Duyệt
                </Button>
                <Button
                  className={classes.skipButton}
                  variant="contained"
                  color="error"
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
