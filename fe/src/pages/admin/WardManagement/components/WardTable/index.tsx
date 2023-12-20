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
import PropertyService from "services/district";
import { Property } from "models/property";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import WardService from "services/ward";

interface FilterProps {
  fieldSearch?: string;
}
export default function WardTable({ fieldSearch }: FilterProps) {
  const rowsPerPage = 6;
  const [page, setPage] = useState({ currentPage: 1, totalPages: 1 });
  const [district, setDistrict] = useState<Property[]>([]);
  const [districtId, setDistrictId] = useState<number>(1);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage({ ...page, currentPage: value });
  };
  useEffect(() => {
    const getAllWard = async () => {
      WardService.getAllWardBy(districtId, {
        search: fieldSearch ? fieldSearch : "",
        current: page.currentPage,
        pageSize: rowsPerPage,
      })
        .then((res) => {
          const property: Property[] = res.content;
          setDistrict(property);
          setPage({ ...page, totalPages: res.totalPages });

          console.log(res.totalElements);
        })
        .catch((err: any) => console.log(err));
    };
    getAllWard();
  }, [fieldSearch, page.currentPage]);

  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left" className={classes.headerTable}>
                Mã Phường
              </TableCell>
              <TableCell align="left" className={classes.headerTable}>
                Tên Phường
              </TableCell>
              <TableCell align="center" className={classes.headerTable}>
                Chức năng
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {district.map((row) => (
              <TableRow key={row.id} className={classes.rowTable}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {row.code}
                </TableCell>
                <TableCell align="left" className={classes.dataTable}>
                  {row.name}
                </TableCell>
                <TableCell align="center" className={classes.dataTable}>
                  <IconButton aria-label="edit" size="medium">
                    <InfoIcon className={classes.infoIcon} />
                  </IconButton>
                  <IconButton aria-label="edit" size="medium">
                    <EditIcon className={classes.editIcon} />
                  </IconButton>
                  <IconButton aria-label="edit" size="medium">
                    <DeleteIcon className={classes.deleteIcon} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {Array(rowsPerPage - district.length)
              .fill(null)
              .map((_, index) => (
                <TableRow key={index} style={{ height: 73 }}>
                  <TableCell colSpan={4} />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <BasicPagination
        color="primary"
        count={page.totalPages}
        page={page.currentPage}
        onChange={handleChangePage}
        className={classes.pagination}
      />
    </Box>
  );
}
