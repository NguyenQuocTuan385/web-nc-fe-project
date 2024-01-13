import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { Box, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Cancel } from "@mui/icons-material";
import { useNavigate, useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import AdvertiseService from "services/advertise";
import queryString from "query-string";
import { Advertise, TAB_ADVERTISE, UpdateStatus } from "models/advertise";
import useIntercepts from "hooks/useIntercepts";
import { DateHelper } from "helpers/date";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { set } from "react-hook-form";

interface FilterProps {
  district?: string;
  ward?: string;
  fieldSearch?: string;
}
export default function EditAdTableLicense({ district, ward, fieldSearch }: FilterProps) {
  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;
  const [page, setPage] = React.useState(() => {
    const params = queryString.parse(locationHook.search);
    return Number(params.page) - 1 || 0;
  });
  const [totalPage, setTotalPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [dataList, setDataList] = useState<Advertise[]>([]);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();
  const intercept = useIntercepts();
  const [data, setData] = useState<Advertise | null>(null);
  const [openAccept, setOpenAccept] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);
  const handleClose = () => {
    setOpenAccept(false);
    setOpenCancel(false);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    navigate({
      pathname: match,
      search: createSearchParams({
        tab: TAB_ADVERTISE.advertise.toString(),
        ...(ward && { propertyId: ward.toString() }),
        ...(district && { parentId: district.toString() }),
        page: (Number(page) + 1).toString()
      }).toString()
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const getAllUnLicensingAdvertisement = async () => {
      AdvertiseService.getAllUnLicensingAdvertisement(
        {
          propertyId: ward ? Number(ward) : undefined,
          parentId: district ? Number(district) : undefined,
          search: fieldSearch,
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
              tab: TAB_ADVERTISE.advertise.toString(),
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
    getAllUnLicensingAdvertisement();
  }, [fieldSearch, page, rowsPerPage, ward, district, update]);

  const emptyRows = rowsPerPage - dataList.length;

  const deleteAdvertiseEdit = async (id: number) => {
    await AdvertiseService.deleteAdvertiseEditById(id, intercept)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateStatus = async (id: number, updateStatus: UpdateStatus) => {
    await AdvertiseService.updateStatus(id, updateStatus, intercept)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const confirmAccept = async () => {
    const updateAdvertise = async () => {
      await AdvertiseService.updateAdvertise(
        data?.id!!,
        {
          licensing: data?.licensing!!,
          width: data?.advertiseEdit?.width!!,
          height: data?.advertiseEdit?.height!!,
          images: data?.advertiseEdit?.images!!,
          locationId: data?.advertiseEdit?.location.id!!,
          adsTypeId: data?.advertiseEdit?.adsType.id!!,
          pillarQuantity: data?.advertiseEdit?.pillarQuantity!!
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
    await updateAdvertise();
    await deleteAdvertiseEdit(data?.advertiseEdit?.id!!);
    setUpdate(true);
    setOpenAccept(false);
  };

  const handleClickAccept = async (event: React.MouseEvent, data: Advertise) => {
    event.stopPropagation();
    setData(data);
    console.log(data);
    setOpenAccept(true);
  };

  const confirmCancel = async () => {
    await updateStatus(data?.id!!, {
      statusEdit: false
    });
    await deleteAdvertiseEdit(data?.advertiseEdit?.id!!);
    setUpdate(true);
    setOpenCancel(false);
  };
  const handleClickCancel = async (event: React.MouseEvent, data: Advertise) => {
    event.stopPropagation();
    setData(data);
    setOpenCancel(true);
  };

  const handleClick = (row: Advertise) => {
    navigate(`${routes.admin.reviewEdit.dcmsAdvertise}`.replace(":id", row.id.toString()));
  };
  return (
    <Box className={classes.boxContainer}>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead className={classes.tableHeading}>
            <TableRow>
              <TableCell className={classes.headerTable}>ID</TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Địa chỉ đặt quảng cáo
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Thời điểm chỉnh sửa
              </TableCell>
              <TableCell align='left' className={classes.headerTable}>
                Loại bảng quảng cáo
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Duyệt
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((row) => (
              <TableRow key={row.id} className={classes.rowTable} onClick={() => handleClick(row)}>
                <TableCell scope='row'>{row.id}</TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  <div className={classes.textOverflow}>{row.location.address}</div>
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.advertiseEdit?.createdAt &&
                    DateHelper.formatDateToDDMMYYYY(row.advertiseEdit?.createdAt)}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.adsType.name}
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
        <DialogTitle id='alert-dialog-title'>Cấp phép chỉnh sửa bảng quảng cáo</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn muốn cấp phép chỉnh sửa bảng quảng cáo này ?
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
        <DialogTitle id='alert-dialog-title'>Cấp phép chỉnh sửa bảng quảng cáo</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn muốn hủy chỉnh sửa bảng quảng cáo này ?
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
