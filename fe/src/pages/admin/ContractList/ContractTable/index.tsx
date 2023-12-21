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
import { Contract } from "models/contract";
import { Advertise } from "models/advertise";

// const rows = [...user];
const rowsPerPage = 7;
interface FilterProps {
  totalPage: number;
  currentPage: number;
  pageSize: number;
  numberOfElements: number;
  status: number;
  fieldSearch: string;
  dataList: Contract[];
}

export default function ContractTable({
  totalPage,
  currentPage,
  pageSize,
  numberOfElements,
  status,
  fieldSearch,
  dataList,
}: FilterProps) {
  const [page, setPage] = useState(currentPage);
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };
  const [filterContractStatus, setFilterContractStatus] = useState(dataList);
  const emptyRows = pageSize - numberOfElements;

  // filter contract's status for Tab Panel
  useEffect(() => {
    // not licensed
    if (status === 1) {
      setFilterContractStatus(
        dataList.filter((contract) => contract.status === 0)
      );
    } else if (status === 2) {
      // licensed
      setFilterContractStatus(
        dataList.filter((contract) => contract.status === 1)
      );
    } else {
      setFilterContractStatus(dataList);
    }
  }, [status]);

  // useEffect(() => {
  //   if (fieldSearch !== "") {
  //     setFilterContractStatus(
  //       dataList.filter((contract) =>
  //         contract.companyName.toLowerCase().includes(fieldSearch.toLowerCase())
  //       )
  //     );
  //   } else {
  //     setFilterContractStatus(dataList);
  //   }
  // }, [fieldSearch, status]);

  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left" className={classes.headerTable}>
                Loại bảng quảng cáo
              </TableCell>
              <TableCell align="left" className={classes.headerTable}>
                Địa chỉ bảng
              </TableCell>
              <TableCell align="left" className={classes.headerTable}>
                Tên công ty ký hợp đồng
              </TableCell>
              <TableCell align="left" className={classes.headerTable}>
                Email công ty
              </TableCell>
              <TableCell align="center" className={classes.headerTable}>
                Tình trạng cấp phép hợp đồng
              </TableCell>
              <TableCell align="center" className={classes.headerTable}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterContractStatus.map((contract) => (
              <TableRow key={contract.id} className={classes.rowTable}>
                <TableCell component="th" scope="row">
                  {contract.id}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {contract.advertise.adsType.name}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {contract.advertise.images}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {contract.companyName}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {contract.companyEmail}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {contract.status}
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
        count={totalPage}
        page={page}
        onChange={handleChangePage}
        className={classes.pagination}
      />
    </Box>
  );
}
