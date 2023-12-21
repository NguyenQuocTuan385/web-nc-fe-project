import React from "react";
import Box from "@mui/material/Box";
import SidebarManagement from "components/admin/SidebarManagement";
import classes from "./styles.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ParagraphBody from "components/common/text/ParagraphBody";
import Button from "@mui/material/Button";
import SouthIcon from "@mui/icons-material/South";
import { useLocation, useNavigate } from "react-router-dom";
import Heading3 from "components/common/text/Heading3";
import SidebarDCMS from "components/admin/SidebarDCMS";

export default function EditAdTableLicenseDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    id,
    address,
    editTime,
    imgUrl,
    width,
    height,
    amount,
    adType,
    tableType,
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
                <Heading3>Thông tin bảng</Heading3>

                <ParagraphBody className={classes.infoContent}>
                  {tableType === edit.tableType ? (
                    <span>{tableType}</span>
                  ) : (
                    <span className={classes.error}>{tableType}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  {address === edit.address ? (
                    <span>{address}</span>
                  ) : (
                    <span className={classes.error}>{address}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Kích thước:&nbsp;
                  {width === edit.width ? (
                    <span>{width}</span>
                  ) : (
                    <span className={classes.error}>{width}</span>
                  )}
                  x
                  {height === edit.height ? (
                    <span>{height}</span>
                  ) : (
                    <span className={classes.error}>{height}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Số lượng:&nbsp;
                  {amount === edit.amount ? (
                    <span>{amount} trụ/ bảng</span>
                  ) : (
                    <span className={classes.error}>{amount} trụ/ bảng</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Hình thức:&nbsp;
                  {adType === edit.adType ? (
                    <span>{adType}</span>
                  ) : (
                    <span className={classes.error}>{adType}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Phân loại:&nbsp;
                  {position === edit.location ? (
                    <span>{position}</span>
                  ) : (
                    <span className={classes.error}>{position}</span>
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
                <Heading3>Thông tin bảng</Heading3>
                <ParagraphBody className={classes.infoContent}>
                  {tableType === edit.tableType ? (
                    <span>{edit.tableType}</span>
                  ) : (
                    <span className={classes.edit}>{edit.tableType}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  {address === edit.address ? (
                    <span>{edit.address}</span>
                  ) : (
                    <span className={classes.edit}>{edit.address}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Kích thước:&nbsp;
                  {width === edit.width ? (
                    <span>{edit.widthn}</span>
                  ) : (
                    <span className={classes.edit}>{edit.width}</span>
                  )}
                  x
                  {height === edit.height ? (
                    <span>{height}</span>
                  ) : (
                    <span className={classes.edit}>{edit.height}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Số lượng:&nbsp;
                  {amount === edit.amount ? (
                    <span>{amount} trụ/ bảng</span>
                  ) : (
                    <span className={classes.edit}>{amount} trụ/ bảng</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Hình thức:&nbsp;
                  {adType === edit.adType ? (
                    <span>{adType}</span>
                  ) : (
                    <span className={classes.edit}>{edit.adType}</span>
                  )}
                </ParagraphBody>
                <ParagraphBody className={classes.infoContent}>
                  Phân loại:&nbsp;
                  {position === edit.location ? (
                    <span>{position}</span>
                  ) : (
                    <span className={classes.edit}>{edit.position}</span>
                  )}
                </ParagraphBody>
              </Box>
            </Box>
          </Box>
          <Box className={classes.editHistoryContainer}>
            <Box className={classes.editInfo}>
              <ParagraphBody className={classes.infoContent}>
                Thời điểm chỉnh sửa:&nbsp;
                <span>{editTime}</span>
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
  );
  // Remove the closing </Box> tag
}
