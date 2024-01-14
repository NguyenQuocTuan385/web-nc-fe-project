import classes from "./styles.module.scss";

import { Header } from "components/common/Header";
import SideBarWard from "components/admin/SidebarWard";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import ReportService from "services/report";
import { EReportType, Report, ReportEditRequest } from "models/report";
import Editor from "components/common/Editor/EditWithQuill";
import { EReportStatus } from "models/report";
import MailService from "services/email";
import { EmailRequest } from "models/email";
import Heading3 from "components/common/text/Heading3";
import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { ERole } from "models/general";
import { DateHelper } from "../../../helpers/date";
import useIntercepts from "hooks/useIntercepts";
import MapAdsManagementAdmin from "../MapAdsManagement";

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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [replyText, setReplyText] = useState("");
  const [handleStatus, setHandleStatus] = useState(EReportStatus.NEW);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState<boolean | null>(null);

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const [dataReportDetail, setDataReportDetail] = useState<Report | null>(null);
  const currentUser = useSelector(selectCurrentUser);
  const intercept = useIntercepts();

  useEffect(() => {
    const getReportById = async () => {
      ReportService.getReportById(Number(id), intercept)
        .then((res) => {
          setDataReportDetail(res);
          setHandleStatus(res.status);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getReportById();
  }, []);

  const goBack = () => {
    currentUser.role.id === ERole.WARD
      ? navigate(`${routes.admin.reports.ward}`)
      : navigate(`${routes.admin.reports.district}`);
  };

  const handleGetValueOnChange = (value: string) => {
    setReplyText(value);
  };

  const handleStatusChange = (e: any) => {
    setHandleStatus(e.target.value);
  };

  const getHandleStatus = (status: number) => {
    let statusStr = "";
    if (status === EReportStatus.NEW) {
      statusStr = "Chưa xử lý";
    } else if (status === EReportStatus.PROCESSING) {
      statusStr = "Đang xử lý";
    } else if (status === EReportStatus.DONE) {
      statusStr = "Đã xử lý";
    }
    return statusStr;
  };

  const handleSendEmail = async () => {
    if (dataReportDetail) {
      const handleReportHtml = `
                                <html>
                                  <head>
                                      <style>
                                          body {
                                            font-size: 16px;
                                          }
                                          h3 {
                                              text-align: center;
                                          }
                                          h5{
                                            font-size: 18px;
                                          }
                                          span {
                                            font-weight: bold;
                                          }
                                      </style>
                                  </head>
                                  <body>
                                      <h3>THÔNG BÁO TÌNH TRẠNG VÀ THÔNG TIN XỬ LÝ BÁO CÁO</h3>
                                      <div>
                                          <h5>Nội dung báo cáo của bạn</h5>
                                          <p><span>- Loại báo cáo: </span>${
                                            dataReportDetail?.reportTypeName ===
                                            EReportType.ADVERTISE
                                              ? "Bảng quảng cáo"
                                              : "Điểm đặt quảng cáo"
                                          }</p>
                                          <p><span>- Địa chỉ: </span>${dataReportDetail?.advertise
                                            ?.location.address}</p>
                                          <p><span>- Nội dung báo cáo: </span>${dataReportDetail?.content}</p>
                                      </div>
                                      <br>
                                      <div>
                                          <h5>Nội dung phản hồi xử lý</h5>
                                          <p><span>- Tình trạng: </span>${getHandleStatus(
                                            handleStatus
                                          )}</p>
                                          <p><span>- Nội dung phản hồi: </span>${
                                            replyText.length > 0
                                              ? replyText
                                              : dataReportDetail?.reply
                                          }</p>
                                      </div>
                                  </body>
                              </html>

  `;

      const data: EmailRequest = {
        toEmail: dataReportDetail.email,
        subject: "[CBP] - Thông tin tình trạng xử lý báo cáo",
        body: handleReportHtml
      };

      MailService.sendHtmlEmail(data, intercept)
        .then((res) => {
          setIsUpdateSuccess(true);
          console.log("Gửi email đến người dân gửi báo cáo thành công!");
        })
        .catch((err) => {
          setIsUpdateSuccess(false);
          console.log(err);
        });
    }
  };

  const handleSubmit = () => {
    const updateData: ReportEditRequest = {
      status: Number(handleStatus),
      reply: replyText.length > 0 ? replyText : dataReportDetail && dataReportDetail.reply
    };

    ReportService.updateReport(Number(id), updateData, intercept)
      .then((res) => {
        handleSendEmail();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reportStatus: any[] = [
    { name: "Chưa xử lý", value: EReportStatus.NEW },
    { name: "Đang xử lý", value: EReportStatus.PROCESSING },
    { name: "Đã xử lý", value: EReportStatus.DONE }
  ];

  return (
    <Box>
      {/* <Header /> */}
      <div className={classes["report-handle-container"]}>
        <SideBarWard>
          <Box className={classes["container-body"]}>
            <ButtonBack onClick={() => goBack()}>
              <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
              Trở về
            </ButtonBack>

            {dataReportDetail && (
              <Box>
                <Heading3>Thông tin xử lý</Heading3>
                <Box className={classes["info-handle-container"]}>
                  <div className={classes["input-container"]}>
                    <label>Loại báo cáo: </label>
                    <TextField
                      className={classes["input-custom"]}
                      defaultValue={dataReportDetail.reportForm.name}
                      id='outlined-required'
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </div>

                  <div className={classes["input-container"]}>
                    <label>Thời điểm gửi: </label>
                    <TextField
                      className={classes["input-custom"]}
                      defaultValue={DateHelper.formatDateToDDMMYYYY(dataReportDetail.createdAt)}
                      id='outlined-required'
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </div>

                  <div className={classes["input-container"]}>
                    <label>Hình thức báo cáo: </label>
                    <TextField
                      className={classes["input-custom"]}
                      defaultValue={
                        dataReportDetail.reportTypeName === EReportType.ADVERTISE
                          ? "Báo cáo bảng quảng cáo"
                          : "Báo cáo địa điểm đặt quảng cáo"
                      }
                      id='outlined-required'
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </div>

                  <div className={classes["input-container"]}>
                    <label>Họ tên người gửi: </label>
                    <TextField
                      className={classes["input-custom"]}
                      defaultValue={dataReportDetail.fullName}
                      id='outlined-required'
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </div>

                  <div className={classes["input-container"]}>
                    <label>Email: </label>
                    <TextField
                      className={classes["input-custom"]}
                      defaultValue={dataReportDetail.email}
                      id='outlined-required'
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </div>

                  <div className={classes["input-container"]}>
                    <label>Số điện thoại: </label>
                    <TextField
                      className={classes["input-custom"]}
                      defaultValue={dataReportDetail.phone}
                      id='outlined-required'
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </div>

                  {dataReportDetail.images && dataReportDetail.images.length > 0 && (
                    <div className={classes["image-container"]}>
                      <label>Hình ảnh báo cáo: </label>
                      <Box className={classes["image-list"]}>
                        {JSON.parse(dataReportDetail.images).map(
                          (imageUrl: string, index: number) => {
                            return (
                              <div className={classes["image-item"]}>
                                <img src={imageUrl} key={index} alt='Hình ảnh báo cáo' />
                              </div>
                            );
                          }
                        )}
                      </Box>
                    </div>
                  )}

                  <Box>
                    <Typography>
                      <span className={classes.title}>Nội dung: </span>
                    </Typography>
                    <Editor
                      placeholder=''
                      isAllowedType={false}
                      content={dataReportDetail.content}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            <Box mt={"30px"} mb={"30px"}>
              <Heading3>Thông tin phản hồi</Heading3>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mb={"20px"}
              >
                <label>Tình trạng: </label>
                {dataReportDetail && (
                  <Select
                    fullWidth
                    className={classes["input-custom"]}
                    value={handleStatus}
                    onChange={(e) => handleStatusChange(e)}
                  >
                    {reportStatus.length > 0 &&
                      reportStatus.map((status: any) => (
                        <MenuItem value={status.value} key={status.value}>
                          {status.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              </Box>
              <Box>
                <label>Phản hồi báo cáo:</label>
                {dataReportDetail && dataReportDetail.reply && (
                  <Editor
                    placeholder=''
                    getValueOnChange={handleGetValueOnChange}
                    isAllowedType={true}
                    content={dataReportDetail.reply}
                  />
                )}

                {dataReportDetail && !dataReportDetail.reply && (
                  <Editor
                    placeholder='Nhập phản hồi...'
                    getValueOnChange={handleGetValueOnChange}
                    isAllowedType={true}
                  />
                )}
              </Box>
            </Box>

            {dataReportDetail && (
              <Box className={classes["map-item"]}>
                <MapAdsManagementAdmin reportView={dataReportDetail} />
              </Box>
            )}
            <ButtonSubmit type='button' onClick={handleSubmit}>
              Gửi
            </ButtonSubmit>
          </Box>

          <Snackbar
            open={isUpdateSuccess !== null}
            autoHideDuration={3000}
            onClose={() => setIsUpdateSuccess(null)}
          >
            <Alert
              severity={isUpdateSuccess ? "success" : "error"}
              onClose={() => setIsUpdateSuccess(null)}
            >
              {isUpdateSuccess
                ? "Gửi phản hồi báo cáo thành công"
                : "Gửi phản hồi báo cáo thất bại"}
            </Alert>
          </Snackbar>
        </SideBarWard>
      </div>
    </Box>
  );
};
