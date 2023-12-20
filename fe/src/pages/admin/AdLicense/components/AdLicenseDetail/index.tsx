import Box from "@mui/material/Box";
import React from "react";
import classes from "./styles.module.scss";
import SidebarManagement from "components/admin/SidebarManagement";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading3 from "components/common/text/Heading3";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

export default function AdLicenseDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, imgUrl, table, company, startDate, endDate } = location.state;
  return (
    <Box className={classes.boxContainer}>
      <SidebarManagement />
      <Box className={classes.boxContent}>
        <Box className={classes.backPage} onClick={() => navigate(-1)}>
          <ArrowBackIcon className={classes.iconBack} />
          Trở về
        </Box>
        <Box className={classes.boxContentDetail}>
          <Box className={classes.imageInfoContainer}>
            <Box className={classes.imageContainer}>
              <img
                src="https://kenh14cdn.com/thumb_w/620/203336854389633024/2023/10/19/photo-6-16976830334011868785001.jpg"
                alt="image"
                className={classes.image}
              />
            </Box>
            <Box className={classes.infoContainer}>
              <Grid container spacing={2} columns={16}>
                <Grid item xs={8}>
                  <Box className={classes.infoTable}>
                    <Heading3>Thông tin bảng</Heading3>
                    <ParagraphBody
                      $colorName="--gray-60"
                      className={classes.infoContent}
                    >
                      {table.type}
                    </ParagraphBody>
                    <ParagraphBody
                      $colorName="--gray-60"
                      className={classes.infoContent}
                    >
                      {table.address}
                    </ParagraphBody>
                    <ParagraphBody
                      $colorName="--gray-60"
                      className={classes.infoContent}
                    >
                      Kích thước:&nbsp;
                      <span>
                        {table.width} x {table.height}
                      </span>
                    </ParagraphBody>
                    <ParagraphBody
                      $colorName="--gray-60"
                      className={classes.infoContent}
                    >
                      Hình thức:&nbsp;
                      <span>{table.form}</span>
                    </ParagraphBody>
                    <ParagraphBody
                      $colorName="--gray-60"
                      className={classes.infoContent}
                    >
                      Phân loại:&nbsp;
                      <span>{table.location}</span>
                    </ParagraphBody>
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Box className={classes.infoCompany}>
                    <Heading3>Thông tin công ty</Heading3>
                    <ParagraphBody
                      $colorName="--gray-60"
                      className={classes.infoContent}
                    >
                      Tên công ty:&nbsp;
                      <span>{company.name}</span>
                    </ParagraphBody>
                    <ParagraphBody
                      $colorName="--gray-60"
                      className={classes.infoContent}
                    >
                      Email:&nbsp;
                      <span>{company.email}</span>
                    </ParagraphBody>
                    <ParagraphBody
                      $colorName="--gray-60"
                      className={classes.infoContent}
                    >
                      Số điện thoại:&nbsp;
                      <span>{company.phone}</span>
                    </ParagraphBody>
                    <ParagraphBody
                      $colorName="--gray-60"
                      className={classes.infoContent}
                    >
                      Địa chỉ:&nbsp;
                      <span>{company.address}</span>
                    </ParagraphBody>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box className={classes.editInfo}>
            <ParagraphBody className={classes.infoContent}>
              Bắt đầu hợp đồng:&nbsp;
              <span>{startDate}</span>
            </ParagraphBody>
            <Box>
              <ParagraphBody className={classes.infoContent}>
                Kết thúc hợp đồng:&nbsp;
                <span>{endDate}</span>
              </ParagraphBody>
              <Box></Box>
            </Box>
          </Box>
          <Divider variant="middle" />

          <Box className={classes.boxMapContainer}>
            <Box className={classes.boxTitle}>
              <Heading3>VỊ TRÍ TRÊN BẢN ĐỒ</Heading3>
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
