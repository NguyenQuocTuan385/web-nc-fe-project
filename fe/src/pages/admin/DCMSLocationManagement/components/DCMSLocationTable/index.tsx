import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Location } from "models/location";
import LocationService from "services/location";
import BasicPagination from "@mui/material/Pagination";
import Heading6 from "components/common/text/Heading6";
import { useNavigate } from "react-router-dom";

interface FilterProps {
  district?: string;
  ward?: string;
  fieldSearch?: string;
}
export default function AdTableLicense({ district, ward, fieldSearch }: FilterProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const rowsPerPage = 7;
  const [page, setPage] = useState({ currentPage: 1, totalPages: 1 });

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage({ ...page, currentPage: value });
  };

  const navigate = useNavigate();

  // const detailLocation = (row: Location) => {
  //   navigate(`/admin/locations/${row.id}`, {
  //     state: {
  //       Location: row
  //     }
  //   });
  // };

  useEffect(() => {
    const getAllLocation = async () => {
      try {
        const res = await LocationService.getLocations({
          search: fieldSearch ? fieldSearch : "",
          current: page.currentPage,
          pageSize: rowsPerPage
        });
        const locations: Location[] = res.content;
        setLocations(locations);
        setPage({ ...page, totalPages: res.totalPages });
      } catch (error) {
        console.log(error);
      }
    };

    getAllLocation();
  }, [fieldSearch, page.currentPage]);

  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Địa chỉ
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Hình thức quảng cáo
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Trạng thái
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Chức năng
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((row) => (
              <TableRow key={row.id} className={classes.rowTable}>
                <TableCell component='th' scope='row'>
                  {row.id}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.address}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.locationType.name}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.planning === true ? (
                    <Heading6 $colorName='--green-600'>Đã quy hoạch</Heading6>
                  ) : (
                    <Heading6 $colorName='--yellow-600'>Chưa quy hoạch</Heading6>
                  )}
                </TableCell>
                <TableCell align='center' className={classes.dataTable}>
                  <IconButton aria-label='edit' size='medium'>
                  {/* <IconButton aria-label='edit' size='medium' onClick={() => detailLocation(row)}> */}
                    <EditIcon className={classes.editIcon} />
                  </IconButton>
                  <IconButton aria-label='delete' size='medium'>
                    <DeleteIcon className={classes.deleteIcon} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {Array(rowsPerPage - locations.length)
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
        color='primary'
        count={page.totalPages}
        page={page.currentPage}
        onChange={handleChangePage}
        className={classes.pagination}
      />
    </Box>
  );
}
