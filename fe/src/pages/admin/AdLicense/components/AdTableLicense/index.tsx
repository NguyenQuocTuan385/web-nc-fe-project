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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Cancel } from "@mui/icons-material";
import ads from "../../../../../adslicense.json";
import { useNavigate } from "react-router-dom";

const rows = [...ads];
interface FilterProps {
  district?: string;
  ward?: string;
  fieldSearch?: string;
}
export default function AdTableLicense({ district, ward, fieldSearch }: FilterProps) {
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
    navigate(`/admin/review/license/${row.id}`, {
      state: {
        id: row.id,
        imgUrl: row.imgUrl,
        table: row.table,
        company: row.company,
        startDate: row.startDate,
        endDate: row.endDate
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
      filteredRows = filteredRows.filter((row) =>
        row.table.address.toLowerCase().includes(fieldSearch?.toLowerCase() ?? "")
      );
    }

    setFilterDistrict(filteredRows);
  }, [district, ward, fieldSearch]);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - (page - 1) * rowsPerPage);

  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Điểm đặt đặt quảng cáo
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Thông tin công ty
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Loại bảng quảng cáo
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Duyệt
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? filterDistrict.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
              (row) => (
                <TableRow key={row.id} className={classes.rowTable} onClick={() => handleClick(row)}>
                  <TableCell component='th' scope='row'>
                    {row.id}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {row.table.address}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {row.company.name}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {row.table.type}
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
