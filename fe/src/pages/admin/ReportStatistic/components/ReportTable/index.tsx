import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import { useNavigate, useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import queryString from "query-string";
import ReportService from "services/report";
import { EReportType, Report } from "models/report";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import useIntercepts from "hooks/useIntercepts";
import { DateHelper } from "helpers/date";

interface FilterProps {
  tab?: string;
  fieldSearch?: string;
}
export default function ReportTable({ tab, fieldSearch }: FilterProps) {
  const chart = [
    { value: 0, label: "Mới" },
    { value: 0, label: "Đang xử lý" },
    { value: 0, label: "Đã xử lý" }
  ];

  const [data, setData] = useState(chart);

  const size = {
    width: 800,
    height: 250
  };

  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;
  const [page, setPage] = React.useState(() => {
    const params = queryString.parse(locationHook.search);
    return Number(params.page) - 1 || 0;
  });
  const [totalPage, setTotalPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [dataList, setDataList] = useState<Report[]>([]);
  const navigate = useNavigate();

  const intercepts = useIntercepts();

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    navigate({
      pathname: match,
      search: createSearchParams({
        page: (Number(page) + 1).toString()
      }).toString()
    });
  };

  const getDynamicColor = (status: number) => {
    if (status === 1) {
      return <span style={{ color: "#FF0000", fontWeight: "bold" }}>Chờ xử lý</span>;
    } else if (status === 2) {
      return <span style={{ color: "#FFA500", fontWeight: "bold" }}>Đang xử lí</span>;
    } else {
      return <span style={{ color: "#008000", fontWeight: "bold" }}>Đã xử lí</span>;
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const getAllReports = async () => {
      ReportService.getReports(
        {
          reportTypeName:
            tab === "0"
              ? undefined
              : tab === "ADVERTISE"
                ? EReportType.ADVERTISE
                : EReportType.LOCATION,
          search: fieldSearch,
          pageSize: rowsPerPage,
          current: Number(page) + 1
        },
        intercepts
      )
        .then((res) => {
          setDataList(res.content);
          setTotalPage(res.totalPages);

          navigate({
            pathname: match,
            search: createSearchParams({
              ...(tab !== "0" && { tab: tab }),
              page: (Number(page) + 1).toString()
            }).toString()
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getAllReports();
  }, [fieldSearch, page, rowsPerPage, tab]);
  let new_value = 0;
  let processing_value = 0;
  let processed_value = 0;

  dataList.map((item) => {
    if (item.status === 1) {
      new_value += 1;
    } else if (item.status === 2) {
      processing_value += 1;
    } else {
      processed_value += 1;
    }
  });

  useEffect(() => {
    setData([
      { value: new_value, label: "Mới" },
      { value: processing_value, label: "Đang xử lý" },
      { value: processed_value, label: "Đã xử lý" }
    ]);
  }, [dataList]);

  const emptyRows = rowsPerPage - dataList.length;

  const handleClick = (row: Report) => {
    navigate(`${routes.admin.statistic.dcmsDetail}`.replace(":id", row.id.toString()));
  };
  return (
    <Box className={classes.boxContainer}>
      <PieChart
        series={[
          {
            arcLabel: (item: { value: number; label?: string }) =>
              `${item.label ?? ""} (${item.value})`,
            arcLabelMinAngle: 45,
            data
          }
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontWeight: "bold",
            fontSize: "14px"
          }
        }}
        {...size}
      />
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead>
            <TableRow className={classes.tableHeading}>
              <TableCell className={classes.headerTable}>ID</TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Họ và tên
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Hình thức báo cáo
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Điểm đặt
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Thời điểm gửi
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Tình trạng
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((row) => (
              <TableRow key={row.id} className={classes.rowTable} onClick={() => handleClick(row)}>
                <TableCell scope='row'>{row.id}</TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.fullName}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.reportForm.name}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  <div className={classes.textOverflow}>
                    {row.address ? row.address : row.advertise?.location.address}
                  </div>
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {DateHelper.formatDateToDDMMYYYY(row.createdAt!!)}
                </TableCell>
                <TableCell align='center' className={classes.dataTable}>
                  {getDynamicColor(row.status)}
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className={classes.pagination}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component='div'
          count={totalPage * rowsPerPage}
          page={Number(page)}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage='Số dòng trên mỗi trang' // Thay đổi text ở đây
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
}
