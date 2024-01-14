import { Box, Button, IconButton, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import SideBarWard from "components/admin/SidebarWard";
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
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { ERole } from "models/general";
import { DateHelper } from "helpers/date";
import useIntercepts from "hooks/useIntercepts";
import MapAdsManagementAdmin from "../MapAdsManagement";
import { loading } from "reduxes/Loading";

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

export const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [dataReportDetail, setDataReportDetail] = useState<Report | null>(null);
  const currentUser = useSelector(selectCurrentUser);
  const intercept = useIntercepts();
  const dispatch = useDispatch();

  useEffect(() => {
    const getReportById = async () => {
      dispatch(loading(true));

      ReportService.getReportById(Number(id), intercept)
        .then((res) => {
          console.log(res);
          setDataReportDetail(res);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          dispatch(loading(false));
        });
    };
    getReportById();
  }, [id, intercept]);

  const goBack = () => {
    currentUser.role.id === ERole.WARD
      ? navigate(`${routes.admin.reports.ward}`)
      : navigate(`${routes.admin.reports.district}`);
  };

  return (
    <Box>
      {/* <Header /> */}
      <div className={classes["report-detail-container"]}>
        <SideBarWard>
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
                </BoxFlex>
              </Box>
            )}
            {dataReportDetail && (
              <>
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
                        <span>{DateHelper.formatDateToDDMMYYYY(dataReportDetail.createdAt)}</span>
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
                </Box>
                <Box>
                  <Typography>
                    <span className={classes["title"]}>Nội dung báo cáo: </span>
                  </Typography>
                  <Editor
                    placeholder=''
                    isAllowedType={false}
                    content={dataReportDetail?.content || "Không có nội dung báo cáo"}
                  />
                </Box>
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
                {dataReportDetail && (
                  <Box className={classes["map-item"]}>
                    <MapAdsManagementAdmin reportView={dataReportDetail} />
                  </Box>
                )}
              </>
            )}
          </Box>
        </SideBarWard>
      </div>
    </Box>
  );
};
