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
import ads from "../../../../../editadtable.json";
import { useNavigate, useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import AdvertiseService from "services/advertise";
import queryString from "query-string";
import { Advertise, TAB_ADVERTISE, UpdateStatus } from "models/advertise";

const rows = [...ads];
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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const getAllUnauthorizedAdvertisement = async () => {
      AdvertiseService.getAllUnauthorizedAdvertisement({
        propertyId: ward ? Number(ward) : undefined,
        parentId: district ? Number(district) : undefined,
        search: fieldSearch,
        pageSize: rowsPerPage,
        current: Number(page) + 1
      })
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
    getAllUnauthorizedAdvertisement();
  }, [fieldSearch, page, rowsPerPage, ward, district, update]);

  const emptyRows = rowsPerPage - dataList.length;
  function convertDateFormat(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  }

  const deleteAdvertiseEdit = async (id: number) => {
    await AdvertiseService.deleteAdvertiseEditById(id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateStatus = async (id: number, updateStatus: UpdateStatus) => {
    await AdvertiseService.updateStatus(id, updateStatus)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClickAccept = async (event: React.MouseEvent, data: Advertise) => {
    event.stopPropagation();
    const updateAdvertise = async (data: Advertise) => {
      await AdvertiseService.updateAdvertise(data.id, {
        licensing: data.licensing,
        width: data.advertiseEdit?.width!!,
        height: data.advertiseEdit?.height!!,
        images: data.advertiseEdit?.images!!,
        locationId: data.advertiseEdit?.location.id!!,
        adsTypeId: data.advertiseEdit?.adsType.id!!,
        pillarQuantity: data.pillarQuantity!!
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    await updateAdvertise(data);
    await deleteAdvertiseEdit(data.advertiseEdit?.id!!);
    setUpdate(true);
  };

  const handleClickCancel = async (event: React.MouseEvent, data: Advertise) => {
    event.stopPropagation();
    await updateStatus(data.id, {
      status: false
    });
    await deleteAdvertiseEdit(data.advertiseEdit?.id!!);
    setUpdate(true);
  };

  const handleClick = (row: Advertise) => {
    navigate(`${routes.admin.reviewEdit.advertise}`.replace(":id", row.id.toString()));
  };
  return (
    <Box className={classes.boxContainer}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.sizeTable} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
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
                  {row.advertiseEdit?.createdAt && convertDateFormat(row.advertiseEdit?.createdAt)}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.adsType.name}
                </TableCell>
                <TableCell align='center' className={classes.dataTable}>
                  <IconButton aria-label='edit' size='medium' onClick={(e) => handleClickAccept(e, row)}>
                    <CheckCircleIcon className={classes.checkIcon} />
                  </IconButton>
                  <IconButton aria-label='edit' size='medium' onClick={(e) => handleClickCancel(e, row)}>
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
      <TablePagination
        component='div'
        count={totalPage * rowsPerPage}
        page={Number(page)}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage='Số dòng trên mỗi trang' // Thay đổi text ở đây
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
