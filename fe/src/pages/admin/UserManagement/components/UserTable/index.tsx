import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BasicPagination from "@mui/material/Pagination";
import { Box, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import classes from "./styles.module.scss";
import user from "../../../../../user.json";
import Popup from "../PopupEditProfile";

const rows = [...user];
const rowsPerPage = 7;
interface FilterProps {
  role: number;
  fieldSearch: string;
}
export default function UserManagementTable({
  role,
  fieldSearch,
}: FilterProps) {
  const [page, setPage] = useState(1);
  const [openPopup, setOpenPopup] = useState(false);
  console.log(role);
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };
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
      setFilterRole(
        rows.filter((row) =>
          row.name.toLowerCase().includes(fieldSearch.toLowerCase())
        )
      );
    } else {
      setFilterRole(rows);
    }
  }, [fieldSearch]);
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filterRole.length - (page - 1) * rowsPerPage);

  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left" className={classes.headerTable}>
                Họ và tên
              </TableCell>
              <TableCell align="left" className={classes.headerTable}>
                Email
              </TableCell>
              <TableCell align="left" className={classes.headerTable}>
                Cán bộ
              </TableCell>
              <TableCell align="left" className={classes.headerTable}>
                Khu vực quản lý
              </TableCell>
              <TableCell align="center" className={classes.headerTable}>
                Tác vụ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterRole
              .slice(
                (page - 1) * rowsPerPage,
                (page - 1) * rowsPerPage + rowsPerPage
              )
              .map((row) => (
                <TableRow
                  key={row.id}
                  className={classes.rowTable}
                  onClick={() => setOpenPopup(true)}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="left" className={classes.dataTable}>
                    {row.name}
                  </TableCell>
                  <TableCell align="left" className={classes.dataTable}>
                    {row.email}
                  </TableCell>
                  <TableCell align="left" className={classes.dataTable}>
                    {row.role}
                  </TableCell>
                  <TableCell align="left" className={classes.dataTable}>
                    {row.location}
                  </TableCell>
                  <TableCell align="center" className={classes.dataTable}>
                    <IconButton aria-label="edit" size="medium">
                      <FontAwesomeIcon icon={faEdit} color="var(--blue-500)" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 73 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <BasicPagination
        color="primary"
        count={Math.ceil(filterRole.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        className={classes.pagination}
      />
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} />
    </Box>
  );
}
