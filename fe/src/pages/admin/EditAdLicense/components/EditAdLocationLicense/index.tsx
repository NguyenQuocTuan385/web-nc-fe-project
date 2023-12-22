import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Box, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import ads from "../../../../../editadlocation.json";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

const rows = [...ads];
interface FilterProps {
  district?: string;
  ward?: string;
  fieldSearch?: string;
}
export default function EditAdLocationLicense({ district, ward, fieldSearch }: FilterProps) {
  const [filterDistrict, setFilterDistrict] = useState(rows);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);

  };
  const navigate = useNavigate();

  const handleClick = (row: any) => {
    navigate(`${routes.admin.reviewEdit.location.replace(":id", `${row.id}`)}`, {
      state: {
        id: row.id,
        address: row.address,
        timeEdit: row.timeEdit,
        planning: row.planning,
        imgUrl: row.imgUrl,
        adsType: row.adsType,
        position: row.location,
        edit: row.edit,
        reason: row.reason
      }
    });
  };
  useEffect(() => {
    let filteredRows = rows;

    if (district) {
      filteredRows = filteredRows.filter((row) => row.district === district);
    }

    if (ward) {
      filteredRows = filteredRows.filter((row) => row.ward === ward);
    }

    if (fieldSearch !== "") {
      filteredRows = filteredRows.filter((row) => row.address.toLowerCase().includes(fieldSearch?.toLowerCase() ?? ""));
    }

    setFilterDistrict(filteredRows);
  }, [district, ward, fieldSearch]);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Địa chỉ đặt quảng cáo
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Thời điểm chỉnh sửa
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Tình trạng
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Duyệt
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? filterDistrict.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
              (row) => (
                <TableRow
                  key={row.id}
                  className={classes.rowTable}
                  onClick={() => {
                    handleClick(row);
                  }}
                >
                  <TableCell scope='row'>{row.id}</TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    <div className={classes.textOverflow}>{row.address}</div>
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {row.timeEdit}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {row.planning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"}
                  </TableCell>
                  <TableCell align='center' className={classes.dataTable}>
                    <IconButton aria-label='edit' size='medium'>
                      <CheckCircleIcon className={classes.checkIcon} />
                    </IconButton>
                    <IconButton aria-label='edit' size='medium'>
                      <Cancel className={classes.cancelIcon} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}

            {emptyRows > 0 && (
              <TableRow style={{ height: 73 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={filterDistrict.length}

        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage='Số dòng trên mỗi trang' // Thay đổi text ở đây
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
