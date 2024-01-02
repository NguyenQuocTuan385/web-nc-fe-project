import {
  Box,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { ReportDialog } from "../LocationSidebar/ReportFormPopup";
import CloseIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import classes from "./styles.module.scss";
import InfoIcon from "@mui/icons-material/Info";
import { EReportStatus, EReportType, Report } from "models/report";
import ReportService from "services/report";
import { Error } from "@mui/icons-material";
import Heading4 from "components/common/text/Heading4";
import { DateHelper } from "helpers/date";
interface ReportInfoPopupProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const ReportInfoPopup = ({ setOpen, open }: ReportInfoPopupProps) => {
  const onClose = () => {
    setOpen(false);
  };
  const [reports, setReports] = React.useState<Report[]>([]);

  useEffect(() => {
    const getReportsUser = async () => {
      ReportService.getReports({ pageSize: 999, email: "nguyenvana@gmail.com" })
        .then((res) => {
          console.log(res.content);
          setReports(res.content);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getReportsUser();
  });
  return (
    <ReportDialog onClose={onClose} aria-labelledby='customized-dialog-title' open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        <Box className={classes.titleWrap}>
          <Error color='error' className={classes.errorIc} />
          <Heading4 $colorName='--red-error'>Danh sách báo cáo</Heading4>
        </Box>
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.sizeTable} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align='left' className={classes.headerTable} style={{ width: 400 }}>
                  Địa điểm báo cáo
                </TableCell>
                <TableCell align='left' className={classes.headerTable}>
                  Ngày đăng
                </TableCell>
                <TableCell align='left' className={classes.headerTable}>
                  Trạng thái
                </TableCell>
                <TableCell align='center' className={classes.headerTable}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((item, index) => (
                <TableRow key={index} className={classes.rowTable}>
                  <TableCell component='th' scope='row'>
                    {index + 1}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {item.reportTypeName === EReportType.LOCATION ? item.address : item.advertise?.location.address}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {DateHelper.formatDateToDDMMYYYY(item.createdAt)}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {item.status === EReportStatus.NEW && "Chưa xử lý"}
                    {item.status === EReportStatus.PROCESSING && "Đang xử lý"}
                    {item.status === EReportStatus.DONE && "Đã xử lý"}
                  </TableCell>
                  <TableCell align='center' className={classes.dataTable}>
                    <IconButton aria-label='edit' size='medium'>
                      <InfoIcon className={classes.infoIcon} color='primary' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </ReportDialog>
  );
};

export default ReportInfoPopup;
