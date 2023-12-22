import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BasicPagination from "@mui/material/Pagination";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar
} from "@mui/material";
import classes from "./styles.module.scss";
import { DistrictService } from "services/district";
import { Property } from "models/property";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { Link, useNavigate } from "react-router-dom";
import EditForm from "../EditForm";

interface FilterProps {
  fieldSearch?: string;
}
export default function DistrictTable({ fieldSearch }: FilterProps) {
  const rowsPerPage = 7;
  const [page, setPage] = useState({ currentPage: 1, totalPages: 1 });
  const [district, setDistrict] = useState<Property[]>([]);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editedDistrict, setEditedDistrict] = useState({ id: 0, name: "", code: "" });
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [districtToDelete, setDistrictToDelete] = useState<number | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null);
  const [editSuccess, setEditSuccess] = useState<boolean | null>(null);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage({ ...page, currentPage: value });
  };

  const handleEditClick = (row: Property) => {
    setEditedDistrict({ id: row.id, name: row.name, code: row.code });
    setEditFormOpen(true);
  };

  const handleEditNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDistrict({ ...editedDistrict, name: event.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      await DistrictService.updateDistrict(editedDistrict.id, {
        name: editedDistrict.name,
        code: editedDistrict.code
      });
      setEditSuccess(true);
      setEditFormOpen(false);
    } catch (error) {
      console.error("Error updating district:", error);
      setEditSuccess(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (editedDistrict.id) {
        await DistrictService.deleteDistrict(editedDistrict.id);
        setDeleteSuccess(true);
      }
      setDeleteConfirmationOpen(false);
    } catch (error) {
      console.error("Error deleting district:", error);
      setDeleteSuccess(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
  };
  const navigate = useNavigate();

  useEffect(() => {
    const getAllDistrict = async () => {
      try {
        const res = await DistrictService.getAllDistrict({
          search: fieldSearch ? fieldSearch : "",
          current: page.currentPage,
          pageSize: rowsPerPage
        });
        const properties: Property[] = res.content;
        setDistrict(properties);
        setPage({ ...page, totalPages: res.totalPages });
      } catch (error) {
        console.log(error);
      }
    };

    getAllDistrict();
  }, [fieldSearch, page.currentPage, editedDistrict, districtToDelete]);

  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Mã Quận
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Tên Quận
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Chức năng
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {district.map((row) => (
              <TableRow key={row.id} className={classes.rowTable}>
                <TableCell component='th' scope='row'>
                  {row.id}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.code}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.name}
                </TableCell>
                <TableCell align='center' className={classes.dataTable}>
                  <IconButton
                    onClick={() => {
                      navigate(`/admin/districts/${row.id}`);
                    }}
                    aria-label='edit'
                    size='medium'
                  >
                    <InfoIcon className={classes.infoIcon} />
                  </IconButton>
                  <IconButton aria-label='edit' size='medium' onClick={() => handleEditClick(row)}>
                    <EditIcon className={classes.editIcon} />
                  </IconButton>
                  <IconButton
                    aria-label='delete'
                    size='medium'
                    onClick={() => {
                      setDistrictToDelete(row.id);
                      setDeleteConfirmationOpen(true);
                    }}
                  >
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
          {editFormOpen && (
            <EditForm
              editedDistrict={editedDistrict.name}
              onEditNameChange={handleEditNameChange}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditFormOpen(false)}
            />
          )}
        </Table>
      </TableContainer>
      <BasicPagination
        color='primary'
        count={page.totalPages}
        page={page.currentPage}
        onChange={handleChangePage}
        className={classes.pagination}
      />
      <Dialog open={deleteConfirmationOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete District</DialogTitle>
        <DialogContent>Are you sure you want to delete this district?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={editSuccess !== null} autoHideDuration={3000} onClose={() => setEditSuccess(null)}>
        <Alert severity={editSuccess ? "success" : "error"} onClose={() => setEditSuccess(null)}>
          {editSuccess ? "Edit successful" : "Edit failed"}
        </Alert>
      </Snackbar>

      {/* Delete Success/Failure Snackbar */}
      <Snackbar open={deleteSuccess !== null} autoHideDuration={3000} onClose={() => setDeleteSuccess(null)}>
        <Alert severity={deleteSuccess ? "success" : "error"} onClose={() => setDeleteSuccess(null)}>
          {deleteSuccess ? "Delete successful" : "Delete failed"}
        </Alert>
      </Snackbar>
    </Box>
  );
}
