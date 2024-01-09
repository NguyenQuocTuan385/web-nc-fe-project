import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TablePagination
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import classes from "./styles.module.scss";
import { Contract, DynamicObject, EContractStatus } from "models/contract";
import ContractService from "services/contract";
import Heading6 from "components/common/text/Heading6";
import clsx from "clsx";
import { createSearchParams, useLocation, useNavigate, useResolvedPath } from "react-router-dom";
import queryString from "query-string";
import { routes } from "routes/routes";

// const rows = [...user];
interface FilterProps {
  propertyId: number;
  status: number;
  fieldSearch: string;
}

export default function ContractTable({ propertyId, status, fieldSearch }: FilterProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;
  const [currentPage, setCurrentPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.page || 1;
  });
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.rowsNum || 5;
  });
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPageValue: number
  ) => {
    setCurrentPage(newPageValue + 1);
    navigate({
      pathname: match,
      search: createSearchParams({
        status: status.toString(),
        page: newPageValue.toString()
      }).toString()
    });
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const [emptyRows, setEmptyRows] = useState(0);
  const [dataList, setDataList] = useState<Contract[]>([]);
  const [totalElements, setTotalElements] = useState(1);
  const [selectedForDelete, setSelectedForDelete] = useState(-1);

  // filter contract's status for Tab Panel
  useEffect(() => {
    // not licensed
    const getContractList = async () => {
      ContractService.getContracts(
        {
          search: fieldSearch,
          status: Number(status) === 0 ? undefined : Number(status),
          pageSize: Number(rowsPerPage),
          current: Number(currentPage)
        },
        propertyId
      )
        .then((res) => {
          if (res.content.length === 0) setCurrentPage(1);

          setDataList(res.content);
          setTotalElements(res.totalElements);
          setEmptyRows(Number(rowsPerPage) - res.numberOfElements);

          var searchParams: DynamicObject = {};
          if (status !== 0) searchParams["status"] = status.toString();
          if (fieldSearch !== "") searchParams["searchKey"] = fieldSearch;

          searchParams["page"] = currentPage.toString();
          searchParams["rowsNum"] = rowsPerPage.toString();

          navigate({
            pathname: match,
            search: createSearchParams(searchParams).toString()
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };

    getContractList();
  }, [status, currentPage, rowsPerPage, fieldSearch]);

  const openDeleteDialogHandle = (id: number) => {
    setOpenDeleteDialog(true);
    setSelectedForDelete(id);
  };

  const closeDeleteDialogHandle = () => {
    setOpenDeleteDialog(false);
  };

  const deleteContractHandle = () => {
    ContractService.deleteContracts(selectedForDelete)
      .then((res) => {
        const newList = dataList.filter((contract) => contract.id != selectedForDelete);

        setDataList(newList);
        setSelectedForDelete(-1);
      })
      .catch((e) => {
        console.log(e);
      });

    setOpenDeleteDialog(false);
  };

  const viewContractDetailHandle = (contractDetailId: number) => {
    navigate(`${routes.admin.contracts.detail.replace(":id", `${contractDetailId}`)}`);
  };

  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Loại bảng quảng cáo
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Địa chỉ bảng
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Tên công ty ký hợp đồng
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Email công ty
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Ngày ký
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Ngày hết hạn
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Tình trạng cấp phép
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((contract) => (
              <TableRow key={contract.id} className={classes.rowTable}>
                <TableCell component='th' align='center' scope='row'>
                  {contract.id}
                </TableCell>
                <TableCell align='left' className={classes.dataTable} scope='row'>
                  {contract.advertise.adsType.name}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {contract.advertise.location.address}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {contract.companyName}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {contract.companyEmail}
                </TableCell>
                <TableCell align='center' className={classes.dataTable}>
                  {contract.startAt.toLocaleString()}
                </TableCell>
                <TableCell align='center' className={classes.dataTable}>
                  {contract.endAt.toLocaleString()}
                </TableCell>
                <TableCell align='center' className={classes.dataTable}>
                  {contract.status === EContractStatus.licensed ? (
                    <Heading6 colorName='--green-600'>Đã cấp phép</Heading6>
                  ) : contract.status === EContractStatus.notLicensed ? (
                    <Heading6 colorName='--red-error'>Chưa cấp phép</Heading6>
                  ) : (
                    <Heading6 colorName='--gray-60'>Đã hết hạn</Heading6>
                  )}
                </TableCell>
                <TableCell align='center' className={clsx(classes.dataTable, classes.dataIcon)}>
                  <IconButton
                    aria-label='edit'
                    size='medium'
                    onClick={() => viewContractDetailHandle(contract.id)}
                  >
                    <FontAwesomeIcon icon={faEye} color='var(--blue-500)' />
                  </IconButton>
                  {contract.status === EContractStatus.notLicensed ? (
                    <IconButton
                      aria-label='edit'
                      size='medium'
                      onClick={() => openDeleteDialogHandle(contract.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} color='var(--red-error)' />
                    </IconButton>
                  ) : (
                    <></>
                  )}
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
          count={totalElements}
          page={Number(currentPage) - 1}
          onPageChange={handleChangePage}
          rowsPerPage={Number(rowsPerPage)}
          labelRowsPerPage='Số dòng trên mỗi trang' // Thay đổi text ở đây
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDialogHandle}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Lưu ý"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn có thật sự muốn xóa cấp phép này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='error' onClick={closeDeleteDialogHandle}>
            Hủy bỏ
          </Button>
          <Button variant='contained' onClick={deleteContractHandle} autoFocus color='success'>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
