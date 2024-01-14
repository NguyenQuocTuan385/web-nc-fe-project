import { Box, Button, IconButton, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EReportType, Report } from "models/report";
import ReportService from "services/report";
import Heading3 from "components/common/text/Heading3";
import Editor from "components/common/Editor/EditWithQuill";
import { routes } from "routes/routes";
import SideBarDCMS from "components/admin/SidebarDCMS";
import useIntercepts from "hooks/useIntercepts";
import MapAdsManagementAdmin from "pages/admin/MapAdsManagement";

const BoxFlex = styled(Box)(() => ({
  display: "flex",
  alignItems: "center"
}));

const ButtonBack = styled(Button)(() => ({
  paddingLeft: "0 !important",
  "&:hover": {
    backgroundColor: "transparent !important"
  }
}));

const IconButtonBack = styled(IconButton)(() => ({
  paddingLeft: "0 !important",
  "&:hover": {
    backgroundColor: "transparent !important"
  }
}));

export const ReportDetailDCMS = () => {
  const { id } = useParams<{ id: string }>();

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const navigate = useNavigate();

  const [dataReportDetail, setDataReportDetail] = useState<Report | null>(null);
  const intercept = useIntercepts();
  useEffect(() => {
    const getReportById = async () => {
      ReportService.getReportById(Number(id), intercept)
        .then((res) => {
          setDataReportDetail(res);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getReportById();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      <div className={classes["report-detail-container"]}>
        <SideBarDCMS>
          <Box className={classes["container-body"]}>
            <ButtonBack onClick={() => goBack()}>
              <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
              Trở về
            </ButtonBack>
            {dataReportDetail && dataReportDetail.images && (
              <Box>
                <Heading3>Hình ảnh báo cáo</Heading3>
                <BoxFlex justifyContent={"space-between"} flexWrap={"wrap"} mt={"15px"}>
                  {dataReportDetail && JSON.parse(dataReportDetail.images).length > 0 && (
                    <Box className={classes["image-list"]}>
                      {JSON.parse(dataReportDetail.images).map((image: string) => {
                        return (
                          <div className={classes["image-item"]}>
                            <img
                              className={classes["image"]}
                              src={image}
                              alt='Hình ảnh bảng QC'
                              style={{ border: "1px solid #ccc" }}
                            />
                          </div>
                        );
                      })}
                    </Box>
                  )}
                  {/* <img
                  width={"48%"}
                  height={"250px"}
                  className={classes["image"]}
                  src={dataReportDetail.images}
                  alt='Hình ảnh bảng QC'
                  style={{ border: "1px solid #ccc" }}
                /> */}
                </BoxFlex>
              </Box>
            )}
            {dataReportDetail && (
              <Box mt={"20px"}>
                <Heading3>Thông tin báo cáo</Heading3>
                <Box display={"flex"} mt={"15px"}>
                  <Box width={"50%"}>
                    <Typography>
                      <span className={classes["title"]}>Loại báo cáo: </span>
                      <span>
                        {dataReportDetail.reportTypeName === EReportType.ADVERTISE
                          ? "Báo cáo bảng quảng cáo"
                          : "Báo cáo địa điểm quảng cáo"}
                      </span>
                    </Typography>
                    <Typography>
                      <span className={classes["title"]}>Thời điểm gửi: </span>
                      <span>{formatDateToString(new Date(dataReportDetail.createdAt))}</span>
                    </Typography>
                    <Typography>
                      <span className={classes["title"]}>Hình thức báo cáo: </span>
                      <span>{dataReportDetail.reportForm.name}</span>
                    </Typography>
                    <Typography>
                      <span className={classes["title"]}>Họ tên người gửi: </span>
                      <span>{dataReportDetail.fullName}</span>
                    </Typography>
                    <Typography>
                      <span className={classes["title"]}>Email: </span>
                      <span>{dataReportDetail.email}</span>
                    </Typography>
                    <Typography>
                      <span className={classes["title"]}>Số điện thoại: </span>
                      <span>{dataReportDetail.phone}</span>
                    </Typography>
                  </Box>
                </Box>
                <Editor placeholder='' isAllowedType={false} content={dataReportDetail.content} />
              </Box>
            )}

            {dataReportDetail && (
              <Box mt='20px'>
                <Heading3>Thông tin xử lý của cán bộ</Heading3>
                <Typography mt={"15px"}>
                  <span className={classes["title"]}>Tình trạng: </span>
                  <span
                    className={`${
                      dataReportDetail.status ? classes["text-active"] : classes["text-inactive"]
                    }`}
                  >
                    {dataReportDetail.status ? "Đã xử lý" : "Chưa xử lý"}
                  </span>
                </Typography>
                <Box>
                  <Typography>
                    <span className={classes["title"]}>Phản hồi: </span>
                  </Typography>
                  <Editor
                    placeholder=''
                    isAllowedType={false}
                    content={dataReportDetail?.reply || "Chưa có thông tin phản hồi"}
                  />
                </Box>
              </Box>
            )}

            {dataReportDetail && (
              <Box className={classes["map-item"]}>
                <MapAdsManagementAdmin reportView={dataReportDetail} />
              </Box>
            )}
          </Box>
        </SideBarDCMS>
      </div>
    </Box>
  );
};
