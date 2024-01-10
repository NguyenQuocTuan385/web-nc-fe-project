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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ReportDialog } from "../LocationSidebar/ReportFormPopup";
import CloseIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import classes from "./styles.module.scss";
import { EReportStatus, EReportType, Report } from "models/report";
import ReportService from "services/report";
import { Error } from "@mui/icons-material";
import Heading4 from "components/common/text/Heading4";
import { DateHelper } from "helpers/date";
import ReportViewPopup from "./ReportViewPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
interface ReportInfoPopupProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const ReportInfoPopup = ({ setOpen, open }: ReportInfoPopupProps) => {
  const onClose = () => {
    setOpen(false);
  };
  const [reports, setReports] = useState<Report[]>([]);
  const [openReportPopup, setOpenReportPopup] = useState<boolean>(false);
  const [reportShow, setReportShow] = useState<Report | null>(null);

  useEffect(() => {
    const getReportsUser = async () => {
      ReportService.getReports({ pageSize: 999, email: "nguyenvana@gmail.com" })
        .then((res) => {
          setReports(res.content);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getReportsUser();
  }, []);
  return (
    <ReportDialog onClose={onClose} aria-labelledby='customized-dialog-title' open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        <Box className={classes.titleWrap}>
          <Error color='error' className={classes.errorIc} />
          <Heading4 colorName='--red-error'>Danh sách báo cáo</Heading4>
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
                <TableCell>STT</TableCell>
                <TableCell align='left' className={classes.headerTable} style={{ width: 400 }}>
                  Địa điểm báo cáo
                </TableCell>
                <TableCell align='left' className={classes.headerTable}>
                  Loại báo cáo
                </TableCell>
                <TableCell align='left' className={classes.headerTable}>
                  Hình thức báo cáo
                </TableCell>
                <TableCell align='left' className={classes.headerTable}>
                  Ngày báo cáo
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
                    {item.reportTypeName === EReportType.LOCATION
                      ? item.address
                      : item.advertise?.location.address}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {item.reportTypeName === EReportType.LOCATION ? "Địa điểm" : "Bảng quảng cáo"}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {item.reportForm.name}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {DateHelper.formatDateToDDMMYYYY(item.createdAt)}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {item.status === EReportStatus.NEW && (
                      <span className={classes.red}>Chưa xử lý</span>
                    )}
                    {item.status === EReportStatus.PROCESSING && (
                      <span className={classes.blue}>Đang xử lý</span>
                    )}
                    {item.status === EReportStatus.DONE && (
                      <span className={classes.green}>Đã xử lý</span>
                    )}
                  </TableCell>
                  <TableCell align='center' className={classes.dataTable}>
                    <IconButton
                      aria-label='edit'
                      size='medium'
                      onClick={() => {
                        setOpenReportPopup(true);
                        setReportShow(item);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} color='var(--blue-500)' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ReportViewPopup open={openReportPopup} setOpen={setOpenReportPopup} report={reportShow} />
      </DialogContent>
    </ReportDialog>
  );
};

export default ReportInfoPopup;
