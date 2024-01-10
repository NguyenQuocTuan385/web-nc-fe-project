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
import { useNavigate, useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import queryString from "query-string";
import LocationService from "services/location";
import { Location, updateStatus } from "models/location";
import { TAB_ADVERTISE } from "models/advertise";

interface FilterProps {
  district?: string;
  ward?: string;
  fieldSearch?: string;
}
export default function EditAdLocationLicense({ district, ward, fieldSearch }: FilterProps) {
  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;
  const [page, setPage] = React.useState(() => {
    const params = queryString.parse(locationHook.search);
    return Number(params.page) - 1 || 0;
  });
  const [totalPage, setTotalPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [dataList, setDataList] = useState<Location[]>([]);
  const [update, setUpdate] = useState(false);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    navigate({
      pathname: match,
      search: createSearchParams({
        tab: TAB_ADVERTISE.location.toString(),
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
  const navigate = useNavigate();
  function formatDateToDDMMYYYY(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    };
    return new Date(date).toLocaleDateString("en-GB", options);
  }

  const handleClick = (row: Location) => {
    navigate(`${routes.admin.reviewEdit.dcmsLocation}`.replace(":id", row.id.toString()));
  };
  useEffect(() => {
    const getAllLocationReview = async () => {
      LocationService.getLocationsReview({
        propertyId: ward ? Number(ward) : undefined,
        parentId: district ? Number(district) : undefined,
        search: fieldSearch,
        pageSize: rowsPerPage,
        current: Number(page) + 1
      })
        .then((res) => {
          setDataList(res.content);
          setTotalPage(res.totalPages);
          setUpdate(false);
          navigate({
            pathname: match,
            search: createSearchParams({
              tab: TAB_ADVERTISE.location.toString(),
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
    getAllLocationReview();
  }, [fieldSearch, page, rowsPerPage, ward, district, update]);
  const emptyRows = rowsPerPage - dataList.length;

  const deleteLocationEdit = async (id: number) => {
    await LocationService.deleteLocationEditById(id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateStatus = async (id: number, updateStatus: updateStatus) => {
    await LocationService.updateStatus(id, updateStatus)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClickAccept = async (event: React.MouseEvent, data: Location) => {
    event.stopPropagation();
    const updateLocation = async (data: Location) => {
      await LocationService.updateLocationsById(data.id, {
        planning: data.locationEdit?.planning!!,
        latitude: data.locationEdit?.latitude!!,
        longitude: data.locationEdit?.longitude!!,
        address: data.locationEdit?.address!!,
        advertiseFormId: data.locationEdit?.adsForm.id!!,
        locationTypeId: data.locationEdit?.locationType.id!!,
        propertyId: data.locationEdit?.property.id!!,
        imageUrls: data.locationEdit?.images!!
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    await updateLocation(data);
    await deleteLocationEdit(data.locationEdit?.id!!);
    setUpdate(true);
  };

  const handleClickCancel = async (event: React.MouseEvent, data: Location) => {
    event.stopPropagation();
    await updateStatus(data.id, {
      status: false
    });
    await deleteLocationEdit(data.locationEdit?.id!!);
    setUpdate(true);
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
                Tình trạng
              </TableCell>
              <TableCell align='center' className={classes.headerTable}>
                Duyệt
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((row) => (
              <TableRow
                key={row.id}
                className={classes.rowTable}
                onClick={() => {
                  handleClick(row);
                }}
              >
                <TableCell scope='row'>{row.id}</TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  <div className={classes.textOverflow}>{row.address}</div>
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.locationEdit?.updatedAt && formatDateToDDMMYYYY(row.locationEdit?.updatedAt)}
                </TableCell>
                <TableCell align='left' className={classes.dataTable}>
                  {row.planning ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH"}
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
    </Box>
  );
}
