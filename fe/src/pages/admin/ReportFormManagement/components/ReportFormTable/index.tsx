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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ReportForm } from "models/reportForm";
import ReportFormService from "services/reportForm";

interface FilterProps {
  fieldSearch?: string;
}
export default function ReportFormTable({ fieldSearch }: FilterProps) {
  const rowsPerPage = 7;
  const [page, setPage] = useState({ currentPage: 1, totalPages: 1 });
  const [reportForm, setReportForm] = useState<ReportForm[]>([]);
  const [editFormOpen, setEditFormOpen] = useState(false);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage({ ...page, currentPage: value });
  };

  useEffect(() => {
    const getReportForms = async () => {
      try {
        const res = await ReportFormService.getAllReportForm({
          search: fieldSearch ? fieldSearch : "",
          current: page.currentPage,
          pageSize: rowsPerPage
        });
        const reportForm: ReportForm[] = res.content;
        setReportForm(reportForm);
        setPage({ ...page, totalPages: res.totalPages });
      } catch (error) {
        console.log(error);
      }
    };

    getReportForms();
  }, [fieldSearch, page.currentPage]);

  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Tên hình thức báo cáo
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Mô tả hình thức báo cáo
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Chức năng
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportForm.map((row) => (
              <TableRow key={row.id} className={classes.rowTable}>
                <TableCell component='th' scope='row'>
                  {row.id}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.name}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.description}
                </TableCell>
                <TableCell align='center' className={classes.dataTable}>
                  <IconButton aria-label='edit' size='medium'>
                    <EditIcon className={classes.editIcon} />
                  </IconButton>
                  <IconButton aria-label='delete' size='medium'>
                    <DeleteIcon className={classes.deleteIcon} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* {Array(rowsPerPage - district.length)
              .fill(null)
              .map((_, index) => (
                <TableRow key={index} style={{ height: 73 }}>
                  <TableCell colSpan={4} />
                </TableRow>
              ))} */}
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
