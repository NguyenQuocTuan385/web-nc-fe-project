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
import ContractService from "services/contract";
import { log } from "console";
import Heading6 from "components/common/text/Heading6";

// const rows = [...user];
interface FilterProps {
  status: number;
  fieldSearch: string;
}

export default function ContractTable({ status, fieldSearch }: FilterProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };
  const pageSize = 5;
  const [emptyRows, setEmptyRows] = useState(0);
  const [dataList, setDataList] = useState<Contract[]>([]);
  const [totalPage, setTotalPage] = useState(1);

  // filter contract's status for Tab Panel
  useEffect(() => {
    // not licensed
    const getContractList = async () => {
      ContractService.getContracts({
        status: status,
        pageSize: pageSize,
        current: currentPage,
      })
        .then((res) => {
          console.log(res.content);

          setDataList(res.content);
          setTotalPage(res.totalPages);
          setEmptyRows(pageSize - res.numberOfElements);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    getContractList();
  }, [status, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
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
            {dataList.map((contract) => (
              <TableRow key={contract.id} className={classes.rowTable}>
                <TableCell component="th" scope="row">
                  {contract.id}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {contract.advertise.adsType.name}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {contract.advertise.location.address}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {contract.companyName}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {contract.companyEmail}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {contract.status == 1 ? (
                    <Heading6 $colorName="--green-600">Đã cấp phép</Heading6>
                  ) : contract.status == 2 ? (
                    <Heading6 $colorName="--red-error">Chưa cấp phép</Heading6>
                  ) : (
                    <Heading6 $colorName="--gray-60">Đã hết hạn</Heading6>
                  )}
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
        page={currentPage}
        onChange={handleChangePage}
        className={classes.pagination}
      />
    </Box>
  );
}
