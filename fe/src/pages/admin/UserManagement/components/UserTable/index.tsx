import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import classes from "./styles.module.scss";
import user from "../../../../../user.json";
import Popup from "../PopupEditProfile/index";
import TablePagination from "@mui/material/TablePagination";

const rows = [...user];
interface FilterProps {
  role: number;
  fieldSearch: string;
}
export default function UserManagementTable({ role, fieldSearch }: FilterProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [openPopup, setOpenPopup] = useState(false);
  console.log(role);

  const [filterRole, setFilterRole] = useState(rows);
  useEffect(() => {
    if (role === 1) {
      setFilterRole(rows.filter((row) => row.role === "Quận"));
    } else if (role === 2) {
      setFilterRole(rows.filter((row) => row.role === "Phường"));
    } else {
      setFilterRole(rows);
    }
  }, [role]);

  useEffect(() => {
    if (fieldSearch !== "") {
      setFilterRole(rows.filter((row) => row.name.toLowerCase().includes(fieldSearch.toLowerCase())));
    } else {
      setFilterRole(rows);
    }
  }, [fieldSearch]);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filterRole.length) : 0;
  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Họ và tên
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Email
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Cán bộ
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Khu vực quản lý
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Tác vụ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? filterRole.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
              (row) => (
                <TableRow key={row.id} className={classes.rowTable} onClick={() => setOpenPopup(true)}>
                  <TableCell component='th' scope='row'>
                    {row.id}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {row.name}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {row.email}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {row.role}
                  </TableCell>
                  <TableCell align='left' className={classes.dataTable}>
                    {row.location}
                  </TableCell>
                  <TableCell align='center' className={classes.dataTable}>
                    <IconButton aria-label='edit' size='medium'>
                      <FontAwesomeIcon icon={faEdit} color='var(--blue-500)' />
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
      <Box className={classes.pagination}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component='div'
          count={filterRole.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage='Số dòng trên mỗi trang' // Thay đổi text ở đây
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} />
    </Box>
  );
}
