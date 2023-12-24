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
import classes from "./styles.module.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Cancel } from "@mui/icons-material";
import ads from "../../../../../editadtable.json";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

const rows = [...ads];
const rowsPerPage = 6;
interface FilterProps {
  district?: string;
  ward?: string;
  fieldSearch?: string;
}
export default function EditAdTableLicense({ district, ward, fieldSearch }: FilterProps) {
  const [page, setPage] = useState(1);
  const [filterDistrict, setFilterDistrict] = useState(rows);
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const navigate = useNavigate();

  const handleClick = (row: any) => {
    navigate(`${routes.admin.reviewEdit.advertise.replace(":id", `${row.id}`)}`, {
      state: {
        id: row.id,
        address: row.address,
        editTime: row.editTime,
        imgUrl: row.imgUrl,
        width: row.width,
        height: row.height,
        amount: row.amount,
        adType: row.adType,
        tableType: row.tableType,
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - (page - 1) * rowsPerPage);

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
                Loại bảng quảng cáo
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Duyệt
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterDistrict.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id} className={classes.rowTable} onClick={() => handleClick(row)}>
                <TableCell scope='row'>{row.id}</TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  <div className={classes.textOverflow}>{row.address}</div>{" "}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.editTime}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.tableType}
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
        color='primary'
        count={Math.ceil(filterDistrict.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        className={classes.pagination}
      />
    </Box>
  );
}
