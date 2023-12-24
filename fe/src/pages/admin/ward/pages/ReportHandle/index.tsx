import classes from "./styles.module.scss";

import reportDetail from "../ReportDetail/report-detail.json";
import { Header } from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

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

const ButtonSubmit = styled(Button)(
  () => `
    background-color: #389B42 !important;
    padding: 10px 15px !important;
    color: #fff !important;
    float: right;
  `
);

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

export const ReportHandle = () => {
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState("");

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

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
    navigate(`${routes.admin.reports.root}`);
  };

  return (
    <Box>
      <Header />
      <div className={classes["report-handle-container"]}>
        <Sidebar></Sidebar>
        <Box className={classes["container-body"]}>
          <ButtonBack onClick={() => goBack()}>
            <IconButtonBack size='medium'>
              <FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>
            </IconButtonBack>
            Trở về
          </ButtonBack>

          <Box>
            <h3>Thông tin xử lý</h3>
            <Box className={classes["info-handle-container"]}>
              <div className={classes["input-container"]}>
                <label>Loại báo cáo</label>
                <input
                  className={classes["input-custom"]}
                  type='text'
                  value={dataReportDetail.reportTypeName}
                  readOnly
                />
              </div>

              <div className={classes["input-container"]}>
                <label>Thời điểm gửi</label>
                <input className={classes["input-custom"]} type='text' value={dataReportDetail.createdAt} readOnly />
              </div>

              <div className={classes["input-container"]}>
                <label>Hình thức báo cáo</label>
                <input
                  className={classes["input-custom"]}
                  type='text'
                  value={dataReportDetail.reportFormName}
                  readOnly
                />
              </div>

              <div className={classes["input-container"]}>
                <label>Họ tên người gửi</label>
                <input className={classes["input-custom"]} type='text' value={dataReportDetail.fullName} readOnly />
              </div>

              <div className={classes["input-container"]}>
                <label>Email</label>
                <input className={classes["input-custom"]} type='text' value={dataReportDetail.email} readOnly />
              </div>

              <div className={classes["input-container"]}>
                <label>Số điện thoại</label>
                <input className={classes["input-custom"]} type='text' value={dataReportDetail.phone} readOnly />
              </div>

              {dataReportDetail.images && dataReportDetail.images.length > 0 && (
                <div className={classes["image-container"]}>
                  <label>Hình ảnh báo cáo</label>
                  <Box className={classes["image-list"]}>
                    {dataReportDetail.images.map((imageUrl: string) => {
                      return (
                        <div className={classes["image-item"]}>
                          <img src={imageUrl} width={"100%"} height={"100%"} alt='Hình ảnh báo cáo' />
                        </div>
                      );
                    })}
                  </Box>
                </div>
              )}

              <Box>
                <Typography>Nội dung</Typography>
                <CKEditor
                  editor={ClassicEditor}
                  data={dataReportDetail.content}
                  onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    console.log("Editor is ready to use!", editor);
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log({ event, editor, data });
                  }}
                  onBlur={(event, editor) => {
                    console.log("Blur.", editor);
                  }}
                  onFocus={(event, editor) => {
                    console.log("Focus.", editor);
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box mt={"30px"} mb={"30px"}>
            <h3>Thông tin phản hồi</h3>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={"20px"}>
              <label>Tình trạng</label>
              <select className={classes["select-custom"]}>
                <option value=''>Chọn tình trạng</option>
                <option value='0'>Đã xử lý</option>
                <option value='1'>Chưa xử lý</option>
              </select>
            </Box>
            <Box>
              <label>Phản hồi báo cáo</label>
              <CKEditor
                editor={ClassicEditor}
                data={replyText}
                onReady={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setReplyText(data);
                }}
                onBlur={(event, editor) => {
                  console.log("Blur.", editor);
                }}
                onFocus={(event, editor) => {
                  console.log("Focus.", editor);
                }}
              />
            </Box>
          </Box>

          <ButtonSubmit type='submit'>Gửi</ButtonSubmit>
        </Box>
      </div>
    </Box>
  );
};
