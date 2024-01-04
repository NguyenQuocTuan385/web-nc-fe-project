import classes from "./styles.module.scss";

import { Header } from "components/common/Header";
import SideBarWard from "components/admin/SidebarWard";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { Alert, Box, Button, IconButton, Snackbar, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import ReportService from "services/report";
import { EReportType, Report, ReportEditRequest } from "models/report";
import Editor from "components/common/Editor/EditWithQuill";
import { EReportStatus } from "models/report";

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
  const [handleStatus, setHandleStatus] = useState(false);
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

  useEffect(() => {
    const getReportById = async () => {
      ReportService.getReportById(Number(id))
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
    navigate(`${routes.admin.reports.root}`);
  };

  const handleGetValueOnChange = (value: string) => {
    setReplyText(value);
  };

  const handleStatusChange = (e: any) => {
    setHandleStatus(e.target.value);
  };

  const handleSubmit = () => {
    const updateData: ReportEditRequest = {
      status: Number(handleStatus),
      reply: replyText
    };

    ReportService.updateReport(Number(id), updateData)
      .then((res) => {
        setIsUpdateSuccess(true);
      })
      .catch((err) => {
        setIsUpdateSuccess(false);
        console.log(err);
      });
  };

  return (
    <Box>
      <Header />
      <div className={classes["report-handle-container"]}>
        <SideBarWard></SideBarWard>
        <Box className={classes["container-body"]}>
          <ButtonBack onClick={() => goBack()}>
            <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
            Trở về
          </ButtonBack>

          {dataReportDetail && (
            <Box>
              <h3>Thông tin xử lý</h3>
              <Box className={classes["info-handle-container"]}>
                <div className={classes["input-container"]}>
                  <label>Loại báo cáo</label>
                  <input
                    className={classes["input-custom"]}
                    type='text'
                    value={dataReportDetail.reportForm.name}
                    readOnly
                  />
                </div>

                <div className={classes["input-container"]}>
                  <label>Thời điểm gửi</label>
                  <input
                    className={classes["input-custom"]}
                    type='text'
                    value={formatDateToString(new Date(dataReportDetail.createdAt))}
                    readOnly
                  />
                </div>

                <div className={classes["input-container"]}>
                  <label>Hình thức báo cáo</label>
                  <input
                    className={classes["input-custom"]}
                    type='text'
                    value={
                      dataReportDetail.reportTypeName === EReportType.ADVERTISE
                        ? "Báo cáo bảng quảng cáo"
                        : "Báo cáo địa điểm đặt quảng cáo"
                    }
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
                      {JSON.parse(dataReportDetail.images).map((imageUrl: string, index: number) => {
                        return (
                          <div className={classes["image-item"]}>
                            <img
                              src={imageUrl}
                              width={"100%"}
                              key={imageUrl + index}
                              height={"100%"}
                              alt='Hình ảnh báo cáo'
                            />
                          </div>
                        );
                      })}
                    </Box>
                  </div>
                )}

                <Box>
                  <Typography>Nội dung</Typography>
                  <Editor placeholder='' isAllowedType={false} content={dataReportDetail.content} />
                </Box>
              </Box>
            </Box>
          )}

          <Box mt={"30px"} mb={"30px"}>
            <h3>Thông tin phản hồi</h3>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={"20px"}>
              <label>Tình trạng</label>
              <select onChange={(e) => handleStatusChange(e)} className={classes["select-custom"]}>
                {dataReportDetail?.status === EReportStatus.NEW && (
                  <>
                    <option value={EReportStatus.NEW} selected>
                      Chưa xử lý
                    </option>
                    <option value={EReportStatus.PROCESSING}>Đang xử lý</option>
                    <option value={EReportStatus.DONE}>Đã xử lý</option>
                  </>
                )}
                {dataReportDetail?.status === EReportStatus.PROCESSING && (
                  <>
                    <option value={EReportStatus.NEW}>Chưa xử lý</option>
                    <option value={EReportStatus.PROCESSING} selected>
                      Đang xử lý
                    </option>
                    <option value={EReportStatus.DONE}>Đã xử lý</option>
                  </>
                )}
                {dataReportDetail?.status === EReportStatus.DONE && (
                  <>
                    <option value={EReportStatus.NEW}>Chưa xử lý</option>
                    <option value={EReportStatus.PROCESSING}>Đang xử lý</option>
                    <option value={EReportStatus.DONE} selected>
                      Đã xử lý
                    </option>
                  </>
                )}
              </select>
            </Box>
            <Box>
              <label>Phản hồi báo cáo</label>
              {dataReportDetail && dataReportDetail.reply && (
                <Editor
                  placeholder=''
                  getValueOnChange={handleGetValueOnChange}
                  isAllowedType={true}
                  content={dataReportDetail.reply}
                />
              )}

              {dataReportDetail && !dataReportDetail.reply && (
                <Editor placeholder='Nhập phản hồi...' getValueOnChange={handleGetValueOnChange} isAllowedType={true} />
              )}
            </Box>
          </Box>

          <ButtonSubmit type='button' onClick={handleSubmit}>
            Gửi
          </ButtonSubmit>
        </Box>

        <Snackbar open={isUpdateSuccess !== null} autoHideDuration={3000} onClose={() => setIsUpdateSuccess(null)}>
          <Alert severity={isUpdateSuccess ? "success" : "error"} onClose={() => setIsUpdateSuccess(null)}>
            {isUpdateSuccess ? "Sửa thành công" : "Sửa thất bại"}
          </Alert>
        </Snackbar>
      </div>
    </Box>
  );
};
