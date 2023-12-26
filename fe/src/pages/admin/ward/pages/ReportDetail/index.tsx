import { Box, Button, IconButton, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import { Header } from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import reportDetail from "./report-detail.json";
import { useNavigate } from "react-router-dom";

interface IReportDetail {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  reportTypeName: string;
  reportFormName: string;
  images: Array<string>;
  createdAt: string;
  content: string;
  reply: string;
}

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

export const ReportDetail = () => {
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

  const dataReportDetail: IReportDetail = {
    id: reportDetail.id,
    fullName: reportDetail.fullName,
    email: reportDetail.email,
    phone: reportDetail.phone,
    reportTypeName: reportDetail.reportTypeName === "ADVERTISE" ? "Bảng quảng cáo" : "Vị trị điểm đặt",
    reportFormName: reportDetail.reportForm.name,
    createdAt: formatDateToString(new Date(reportDetail.createdAt)),
    images: JSON.parse(reportDetail.images),
    content: reportDetail.content,
    reply: reportDetail.reply
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      <Header />
      <div className={classes["report-detail-container"]}>
        <Sidebar></Sidebar>
        <Box className={classes["container-body"]}>
          <ButtonBack onClick={goBack}>
            <IconButtonBack size='medium'>
              <FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>
            </IconButtonBack>
            Trở về
          </ButtonBack>
          <Box>
            <h3>Hình ảnh báo cáo</h3>
            <BoxFlex justifyContent={"space-between"} mt={"15px"}>
              {dataReportDetail.images.length > 0 &&
                dataReportDetail.images.map((image: string) => {
                  return (
                    <img
                      width={"48%"}
                      height={"250px"}
                      className={classes["image"]}
                      src={image}
                      alt='Hình ảnh bảng QC'
                    />
                  );
                })}
            </BoxFlex>
          </Box>
          <Box mt={"20px"}>
            <h3>Thông tin báo cáo</h3>
            <Box display={"flex"} mt={"15px"}>
              <Box width={"50%"}>
                <Typography>
                  <span className={classes["title"]}>Loại báo cáo: </span>
                  <span>{dataReportDetail.reportTypeName}</span>
                </Typography>
                <Typography>
                  <span className={classes["title"]}>Thời điểm gửi: </span>
                  <span>{dataReportDetail.createdAt}</span>
                </Typography>
                <Typography>
                  <span className={classes["title"]}>Hình thức báo cáo: </span>
                  <span>{dataReportDetail.reportFormName}</span>
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
              <Box width={"50%"}>
                <span className={classes["title"]}>Nội dung báo cáo: </span>
                <Typography>{reportDetail.content}</Typography>
              </Box>
            </Box>
          </Box>

          <Box mt='20px'>
            <h3>Thông tin xử lý của cán bộ</h3>
            <Typography mt={"15px"}>
              <span className={classes["title"]}>Tình trạng: </span>
              <span className={`${reportDetail.status ? classes["text-active"] : classes["text-inactive"]}`}>
                {reportDetail.status ? "Đã xử lý" : "Chưa xử lý"}
              </span>
            </Typography>
            <Typography>
              <span className={classes["title"]}>Phản hồi: </span>
              <div>{reportDetail.reply}</div>
            </Typography>
          </Box>
        </Box>
      </div>
    </Box>
  );
};
