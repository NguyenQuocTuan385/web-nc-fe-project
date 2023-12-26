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
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import classes from "./styles.module.scss";
import Popup from "../PopupEditProfile/index";
import TablePagination from "@mui/material/TablePagination";
import { User } from "models/user";
import { createSearchParams, useLocation, useResolvedPath } from "react-router-dom";
import Userservice from "services/user";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import AlertDialog from "components/admin/ConfirmDialog";

interface FilterProps {
  role: number;
  fieldSearch: string;
}
export default function UserManagementTable({ role, fieldSearch }: FilterProps) {
  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;
  const [page, setPage] = React.useState(() => {
    const params = queryString.parse(locationHook.search);
    return Number(params.page) - 1 || 0;
  });
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalPage, setTotalPage] = useState(1);
  const [dataList, setDataList] = useState<User[]>([]);
  const [user, setUser] = useState<User>();
  const [openPopup, setOpenPopup] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = useState(0);
  const handleClick = (id: number) => {
    const getUserById = async () => {
      Userservice.getUserbyId(id)
        .then((res) => {
          setUser(res);
          setOpenPopup(true);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUserById();
  };
  const handleClickDelete = (id: number) => {
    setOpen(true);
    console.log(id);
    setId(id);
  };
  const navigate = useNavigate();
  const getUsers = async () => {
    Userservice.getUsers({
      search: fieldSearch,
      ...(role && { roleId: role }),
      pageSize: rowsPerPage,
      current: Number(page) + 1
    })
      .then((res) => {
        setDataList(res.content);
        setTotalPage(res.totalPages);

        navigate({
          pathname: match,
          search: createSearchParams({
            ...(role && { role: role.toString() }),
            page: (Number(page) + 1).toString()
          }).toString()
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUsers();
  }, [role, rowsPerPage, page, fieldSearch]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    navigate({
      pathname: match,
      search: createSearchParams({
        ...(role && { role: role.toString() }),
        page: (Number(newPage) + 1).toString()
      }).toString()
    });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const confirmDelete = (id: number) => {
    const deleteUser = async () => {
      Userservice.deleteUser(id)
        .then((res) => {
          getUsers();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    setOpen(false);
    deleteUser();
  };
  const emptyRows = rowsPerPage - dataList.length;

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
            {dataList.map((row) => (
              <TableRow key={row.id} className={classes.rowTable}>
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
                  {row.role.id === 2 ? "Phường" : "Quận"}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.property.propertyParent === null
                    ? row.property.name
                    : row.property.name + ", " + row.property.propertyParent?.name}
                </TableCell>
                <TableCell align='center' className={classes.dataTable}>
                  <IconButton aria-label='edit' size='medium' onClick={() => handleClick(row.id)}>
                    <FontAwesomeIcon icon={faEdit} color='var(--blue-500)' />
                  </IconButton>
                  <IconButton aria-label='delete' size='medium' onClick={() => handleClickDelete(row.id)}>
                    <FontAwesomeIcon icon={faTrash} color='var(--red-error)' />
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
      <Box className={classes.pagination}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component='div'
          count={totalPage * rowsPerPage}
          page={Number(page)}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage='Số dòng trên mỗi trang' // Thay đổi text ở đây
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      {user && <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} user={user} onUpdated={getUsers} />}
      <AlertDialog
        open={open}
        setOpen={setOpen}
        title='Xác nhận xóa?'
        content='Bạn có chắc chắn muốn xóa tài khoản này?'
        confirm={confirmDelete}
        id={id}
      />
    </Box>
  );
}
