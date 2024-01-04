import React, { useState, useEffect } from "react";
import { Pagination, Box, Dialog, DialogContent, Button } from "@mui/material";
import { useNavigate, useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import queryString from "query-string";

import classes from "./styles.module.scss";

import SideBarWard from "components/admin/SidebarWard";
import TableTemplate from "components/common/TableTemplate";
import SearchAppBar from "components/common/Search";
import { Header } from "components/common/Header";
import LocationService from "services/location";
import { routes } from "routes/routes";
import WardFilter from "components/admin/WardFilter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { openFilterDialog } from "reduxes/Status";

const DistrictLocationManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const itemsPerPage = 5;

  const [locationList, setLocationList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;
  const [searchParams, setSearchParams] = useState(() => {
    const params = queryString.parse(locationHook.search);

    if (params.wardFilter !== null) {
      if (Array.isArray(params.wardFilter)) return params.wardFilter;
      else if (Number.isInteger(Number(params.wardFilter))) return [params.wardFilter.toString()];
    }
    return [];
  });
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
      LocationService.getLocationsWithPropertyAndParent({
        propertyId: [],
        parentId: [],
        search: searchValue,
        pageSize: itemsPerPage,
        current: Number(currentPage)
      })
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

  useEffect(() => {
    const params = queryString.parse(locationHook.search);

    if (params.wardFilter === undefined || params.wardFilter === null) setSearchParams([null]);
    else {
      if (Array.isArray(params.wardFilter)) {
        setSearchParams(params?.wardFilter);
      } else if (Number.isInteger(Number(params.wardFilter)))
        setSearchParams([params.wardFilter.toString()]);
    }
  }, [locationHook.search]);

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
    navigate(`${routes.admin.advertises.ofLocation.replace(":id", `${idLocation}`)}`);
  };

  const handleEditLocation = (idLocation: number) => {
    navigate(`${routes.admin.locations.edit.replace(":id", `${idLocation}`)}`);
  };

  const handleSearch = (query: string) => {
    setSearchValue(query);
  };
  const openFilterDialogValue = useSelector((state: RootState) => state.status.isOpenFilterDialog);

  const openFilterDialogHandle = () => {
    dispatch(openFilterDialog(true));
  };

  return (
    <Box>
      <Header />
      <div className={classes["location-management-container"]}>
        <SideBarWard></SideBarWard>
        <Box className={classes["container-body"]}>
          <Box className={classes["search-container"]}>
            <SearchAppBar onSearch={handleSearch} />
            <Button onClick={openFilterDialogHandle}>LỌC PHƯỜNG</Button>
          </Box>
          <Box className={classes["table-container"]}>
            <Box className={classes["table-container"]}>
              <TableTemplate
                data={data}
                customHeading={customHeading}
                customColumns={customColumns}
                isActionColumn={true}
                onViewAdsClick={handleViewAds}
                onEditClick={handleEditLocation}
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
      </div>

      <Dialog
        open={Boolean(openFilterDialogValue)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <WardFilter
            selectedId={searchParams}
            propertyList={[
              {
                id: 3,
                name: "Phường Nguyễn Cư Trinh",
                code: "PHUONG",
                propertyParent: {
                  id: 1,
                  name: "Quận 5",
                  code: "QUAN",
                  propertyParent: undefined
                }
              },
              {
                id: 4,
                name: "Phường 4",
                code: "PHUONG",
                propertyParent: {
                  id: 1,
                  name: "Quận 5",
                  code: "QUAN",
                  propertyParent: undefined
                }
              },
              {
                id: 5,
                name: "Phường 3",
                code: "PHUONG",
                propertyParent: {
                  id: 1,
                  name: "Quận 5",
                  code: "QUAN",
                  propertyParent: undefined
                }
              }
            ]}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DistrictLocationManagement;
