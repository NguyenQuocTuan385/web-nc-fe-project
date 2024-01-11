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
import { Contract, EContractStatus } from "models/contract";
import ContractService from "services/contract";
import Heading6 from "components/common/text/Heading6";
import clsx from "clsx";
import { useLocation, useNavigate, useResolvedPath, useSearchParams } from "react-router-dom";
import queryString from "query-string";
import { routes } from "routes/routes";
import useIntercepts from "hooks/useIntercepts";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/user";
import { ERole } from "models/general";

// const rows = [...user];
interface FilterProps {
  status: number;
  fieldSearch: string;
}

export default function ContractTable({ status, fieldSearch }: FilterProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const currentUser: User = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.page || 1;
  });
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.rowsNum || 5;
  });
  const [filteredId, setFilterdId] = useState(() => {
    const params = queryString.parse(locationHook.search);
    if (params.wardFilter !== null) {
      if (Array.isArray(params.wardFilter)) return params.wardFilter.map(Number);
      else if (Number.isInteger(Number(params.wardFilter))) return [Number(params.wardFilter)];
    }

    return [];
  });

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPageValue: number
  ) => {
    setCurrentPage(newPageValue + 1);
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
  const intercept = useIntercepts();

  // filter contract's status for Tab Panel
  useEffect(() => {
    // not licensed
    const getContractList = async () => {
      try {
        const res = await ContractService.getContractByPropertyAndParent(
          {
            propertyId: filteredId,
            parentId: [currentUser.property.id],
            search: fieldSearch,
            status: Number(status) === 0 ? undefined : Number(status),
            pageSize: Number(rowsPerPage),
            current: Number(currentPage)
          },
          intercept
        );

        if (res.content.length === 0) setCurrentPage(1);

        setDataList(res.content);
        setTotalElements(res.totalElements);
        setEmptyRows(Number(rowsPerPage) - res.numberOfElements);

        if (status !== 0) searchParams.set("status", status.toString());
        else searchParams.delete("status");

        if (fieldSearch !== "") searchParams.set("searchKey", fieldSearch.toString());

        searchParams.set("page", currentPage.toString());
        searchParams.set("rowsNum", rowsPerPage.toString());
        setSearchParams(searchParams);
      } catch (err: any) {}
    };

    getContractList().catch((e) => {
      console.log(e);
    });
  }, [status, currentPage, rowsPerPage, fieldSearch, filteredId]);

  useEffect(() => {
    const params = queryString.parse(locationHook.search);
    if (params.wardFilter === null || params.wardFilter === undefined) setFilterdId([]);
    else {
      if (Array.isArray(params.wardFilter)) setFilterdId(params.wardFilter.map(Number));
      else if (Number.isInteger(Number(params.wardFilter)))
        setFilterdId([Number(params.wardFilter)]);
    }
  }, [locationHook.search]);

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
    currentUser.role.id === ERole.WARD
      ? navigate(`${routes.admin.contracts.detailWard.replace(":id", `${contractDetailId}`)}`)
      : navigate(`${routes.admin.contracts.detailDistrict.replace(":id", `${contractDetailId}`)}`);
  };

  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead className={classes["table-head"]}>
            <TableRow>
              <TableCell className={classes.headerTable}>ID</TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Loại bảng quảng cáo
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Địa chỉ bảng
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Tên công ty
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Email công ty
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Ngày ký
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Ngày hết hạn
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Cấp phép
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
                <TableCell align='left' className={classes.dataTable}>
                  {contract.startAt.toLocaleString()}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {contract.endAt.toLocaleString()}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
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
              <TableRow style={{ height: 73 }}>
                <TableCell colSpan={9} align='center'>
                  Không có dữ liệu
                </TableCell>
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
