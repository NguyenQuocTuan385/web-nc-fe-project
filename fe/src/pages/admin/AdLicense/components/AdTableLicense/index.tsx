import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Box, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Cancel } from "@mui/icons-material";
import { useNavigate, useResolvedPath, useLocation, createSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import { Contract, EContractStatus } from "models/contract";
import ContractService from "services/contract";
import queryString from "query-string";
import AdvertiseService from "services/advertise";
import useIntercepts from "hooks/useIntercepts";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { DateHelper } from "helpers/date";
interface FilterProps {
  district?: number;
  ward?: number;
  fieldSearch?: string;
}
export default function AdTableLicense({ district, ward, fieldSearch }: FilterProps) {
  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;
  const [update, setUpdate] = useState(false);
  const intercept = useIntercepts();

  const [page, setPage] = React.useState(() => {
    const params = queryString.parse(locationHook.search);
    return Number(params.page) - 1 || 0;
  });
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dataList, setDataList] = useState<Contract[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [openAccept, setOpenAccept] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);
  const [data, setData] = useState<Contract | null>(null);
  const handleClose = () => {
    setOpenAccept(false);
    setOpenCancel(false);
  };

  useEffect(() => {
    const getAllContractByProperty = async () => {
      ContractService.getContractsByProperty(
        {
          propertyId: ward ? [ward] : [],
          parentId: district ? [district] : [],
          search: fieldSearch,
          status: EContractStatus.notLicensed,
          pageSize: rowsPerPage,
          current: Number(page) + 1
        },
        intercept
      )
        .then((res) => {
          setUpdate(false);
          setDataList(res.content);
          setTotalPage(res.totalPages);
          navigate({
            pathname: match,
            search: createSearchParams({
              ...(ward && { propertyId: ward.toString() }),
              ...(district && { parentId: district.toString() }),
              page: (Number(page) + 1).toString()
            }).toString()
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllContractByProperty();
  }, [district, ward, fieldSearch, page, rowsPerPage, update]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    navigate({
      pathname: match,
      search: createSearchParams({
        page: (Number(newPage) + 1).toString()
      }).toString()
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const navigate = useNavigate();

  const handleClick = (row: Contract) => {
    navigate(`${routes.admin.reviewLisence.dcmsDetail}`.replace(":id", row.id.toString()));
  };
  const updateAdvertisesById = async (row: Contract) => {
    AdvertiseService.updateAdvertiseLicense(
      row.advertise.id,
      {
        licensing: true
      },
      intercept
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateContractById = async (row: Contract) => {
    ContractService.updateContractById(
      row.id,
      {
        status: EContractStatus.licensed
      },
      intercept
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const confirmAccept = async () => {
    setOpenAccept(false);
    await updateAdvertisesById(data!!);
    await updateContractById(data!!).then(() => {
      setUpdate(true);
    });
  };
  const handleClickAccept = (event: React.MouseEvent, row: Contract) => {
    event.stopPropagation();
    setData(row);
    setOpenAccept(true);
  };

  const confirmCancel = async () => {
    setOpenCancel(false);
    await updateContractById(data!!).then(() => {
      setUpdate(true);
    });
  };
  const handleClickCancel = (event: React.MouseEvent, row: Contract) => {
    event.stopPropagation();
    setData(row);
    setOpenCancel(true);
  };
  const emptyRows = rowsPerPage - dataList.length;

  return (
    <Box className={classes.boxContainer}>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead className={classes.tableHeading}>
            <TableRow>
              <TableCell className={classes.headerTable}>ID</TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Điểm đặt đặt quảng cáo
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Thông tin công ty
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Loại bảng quảng cáo
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Thời gian gửi
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Duyệt
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((row) => (
              <TableRow key={row.id} className={classes.rowTable} onClick={() => handleClick(row)}>
                <TableCell component='th' scope='row'>
                  {row.id}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  <div className={classes.textOverflow}> {row.advertise.location.address}</div>
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.companyName}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.advertise.adsType.description}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {DateHelper.formatDateToDDMMYYYY(row.createdAt)}
                </TableCell>
                <TableCell align='center' className={classes.dataTable}>
                  <IconButton
                    aria-label='edit'
                    size='medium'
                    onClick={(e) => handleClickAccept(e, row)}
                  >
                    <CheckCircleIcon className={classes.checkIcon} />
                  </IconButton>
                  <IconButton
                    aria-label='edit'
                    size='medium'
                    onClick={(e) => handleClickCancel(e, row)}
                  >
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
      <Box className={classes.pagination}>
        <TablePagination
          component='div'
          rowsPerPageOptions={[5, 10, 25, 100]}
          count={totalPage * rowsPerPage}
          page={Number(page)}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage='Số dòng trên mỗi trang' // Thay đổi text ở đây
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <Dialog
        open={openAccept}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Cấp phép quảng cáo</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn muốn cấp phép quảng cáo này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={confirmAccept} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCancel}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Hủy cấp phép quảng cáo</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn muốn hủy cấp phép quảng cáo này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={confirmCancel} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
