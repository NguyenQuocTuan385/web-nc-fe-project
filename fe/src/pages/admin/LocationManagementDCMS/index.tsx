import React, { useState, useEffect } from "react";
import {
  Pagination,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { useNavigate, useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import queryString from "query-string";

import classes from "./styles.module.scss";

import SearchAppBar from "components/common/SearchDCMS";
import { Header } from "components/common/Header";
import LocationService from "services/location";
import { routes } from "routes/routes";
import TableTemplateDCMS from "components/common/TableTemplateDCMS";
import SideBarDCMS from "components/admin/SidebarDCMS";
import useIntercepts from "hooks/useIntercepts";

const LocationManagementDCMS = () => {
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const [locationList, setLocationList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;

  const [currentPage, setCurrentPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.page || 1;
  });
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPageValue: number) => {
    setCurrentPage(newPageValue);
    navigate({
      pathname: match,
      search: createSearchParams({
        page: newPageValue.toString()
      }).toString()
    });
  };

  useEffect(() => {
    const getAllLocations = async () => {
      LocationService.getLocations(
        {
          search: searchValue,
          pageSize: itemsPerPage,
          current: Number(currentPage)
        },
        intercept
      )
        .then((res) => {
          setLocationList(res.content);
          setTotalPage(res.totalPages);
          setTotalElements(res.totalElements);

          navigate({
            pathname: match,
            search: createSearchParams({
              page: currentPage.toString()
            }).toString()
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getAllLocations();
  }, [currentPage, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const data = locationList.map((location: any, index: number) => {
    return {
      stt: index + 1,
      id: location.id,
      address: location.address,
      adsForm: location.adsForm.name,
      objectStatus: {
        name: location.planning ? "Đã quy hoạch" : "Chưa quy hoạch",
        value: location.planning
      }
    };
  });

  const customHeading = ["STT", "Mã", "Địa chỉ", "Hình thức quảng cáo", "Tình trạng quy hoạch"];
  const customColumns = ["stt", "id", "address", "adsForm", "objectStatus"];

  // const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleViewAds = (idLocation: number) => {
    navigate(`${routes.admin.locations.dcmsDetail.replace(":id", `${idLocation}`)}`);
  };

  const handleEditLocation = (idLocation: number) => {
    navigate(`${routes.admin.locations.dcmsEdit.replace(":id", `${idLocation}`)}`);
  };

  const handleSearch = (query: string) => {
    setSearchValue(query);
  };

  const handleCreateLocation = (idLocation: number) => {
    navigate(`${routes.admin.advertises.dcmsCreate.replace(":id", `${idLocation}`)}`);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [locationId, setLocationId] = useState(0);
  const closeDeleteDialogHandle = () => {
    setOpenDeleteDialog(false);
  };
  const handleDeleteClick = (idLocation: number) => {
    setLocationId(idLocation);
    setOpenDeleteDialog(true);
  };
  const intercept = useIntercepts();
  const deleteLocation = (idLocation: number) => {
    LocationService.deleteLocationById(idLocation, intercept)
      .then((res) => {
        setLocationList(locationList.filter((location: any) => location.id !== idLocation));
        setOpenDeleteDialog(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Box>
      {/* <Header /> */}
      <div className={classes["location-management-container"]}>
        <SideBarDCMS>
          <Box className={classes["container-body"]}>
            <Box className={classes["search-container"]}>
              <SearchAppBar onSearch={handleSearch} />
            </Box>
            <Box className={classes["table-container"]}>
              <Box className={classes["table-container"]}>
                <TableTemplateDCMS
                  data={data}
                  customHeading={customHeading}
                  customColumns={customColumns}
                  isActionColumn={true}
                  onViewAdsClick={handleViewAds}
                  onEditClick={handleEditLocation}
                  onAddClick={handleCreateLocation}
                  onDeleteClick={handleDeleteClick}
                />

                <Box className={classes["pagination-custom"]}>
                  <span>{`Hiển thị ${Math.min(
                    Number(currentPage) * itemsPerPage,
                    totalElements
                  )} kết quả trên ${totalElements}`}</span>
                  <Pagination
                    count={totalPage}
                    page={Number(currentPage)}
                    onChange={handleChangePage}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </SideBarDCMS>
      </div>
      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDialogHandle}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Lưu ý"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn có thật sự muốn xóa địa điểm này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='error' onClick={closeDeleteDialogHandle}>
            Hủy bỏ
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              deleteLocation(locationId);
            }}
            autoFocus
            color='success'
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LocationManagementDCMS;
