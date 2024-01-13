import React, { useState, useEffect } from "react";
import { Pagination, Box, Dialog, DialogContent, Button, TablePagination } from "@mui/material";
import {
  useNavigate,
  useLocation,
  useResolvedPath,
  createSearchParams,
  useSearchParams
} from "react-router-dom";
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
import useIntercepts from "hooks/useIntercepts";
import { selectCurrentUser } from "reduxes/Auth";
import DistrictService from "services/district";
import { User } from "models/user";

const DistrictLocationManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [locationList, setLocationList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const locationHook = useLocation();
  const [searchParamFilter, setSearchParamFilter] = useState(() => {
    const params = queryString.parse(locationHook.search);

    if (params.wardFilter !== null) {
      if (Array.isArray(params.wardFilter)) return params.wardFilter;
      else if (Number.isInteger(Number(params.wardFilter))) return [params.wardFilter.toString()];
    }
    return [];
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
  const [currentPage, setCurrentPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.page || 1;
  });
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPageValue: number
  ) => {
    setCurrentPage(newPageValue + 1);
    searchParams.set("page", (newPageValue + 1).toString());
    setSearchParams(searchParams);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
    searchParams.set("rowsNum", rowsPerPage.toString());
  };
  const intercept = useIntercepts();
  const currentUser: User = useSelector(selectCurrentUser);
  const [wardList, setWardList] = useState([]);

  useEffect(() => {
    DistrictService.getWardWithParentId(currentUser.property.id, intercept)
      .then((res) => {
        setWardList(res.content);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    const getAllLocations = async () => {
      LocationService.getLocationsWithPropertyAndParent(
        {
          propertyId: filteredId,
          parentId: [currentUser.property.id],
          search: searchValue,
          pageSize: Number(rowsPerPage),
          current: Number(currentPage)
        },
        intercept
      )
        .then((res) => {
          if (res.content.length === 0) setCurrentPage(1);

          setLocationList(res.content);
          setTotalPage(res.totalPages);
          setTotalElements(res.totalElements);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getAllLocations();
  }, [currentPage, searchValue, filteredId, rowsPerPage]);

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [searchValue]);

  useEffect(() => {
    const params = queryString.parse(locationHook.search);

    if (params.wardFilter === undefined || params.wardFilter === null) {
      setFilterdId([]);
      setSearchParamFilter([null]);
    } else {
      if (Array.isArray(params.wardFilter)) {
        setSearchParamFilter(params?.wardFilter);
        setFilterdId(params.wardFilter.map(Number));
      } else if (Number.isInteger(Number(params.wardFilter))) {
        setSearchParamFilter([params.wardFilter.toString()]);
        setFilterdId([Number(params.wardFilter)]);
      }
    }
  }, [locationHook.search]);

  const data = locationList.map((location: any, index: number) => {
    return {
      stt: (Number(currentPage) - 1) * Number(rowsPerPage) + index + 1,
      id: location.id,
      address: location.address,
      adsForm: location.adsForm.name,
      objectStatus: {
        name: location.planning ? "Đã quy hoạch" : "Chưa quy hoạch",
        value: location.planning
      }
    };
  });

  const customHeading = ["STT", "Địa chỉ", "Hình thức quảng cáo", "Tình trạng quy hoạch"];
  const customColumns = ["stt", "id", "address", "adsForm", "objectStatus"];

  const onCloseFilterDialogHandle = () => {
    dispatch(openFilterDialog(false));
  };

  // const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleViewAds = (idLocation: number) => {
    navigate(`${routes.admin.advertises.districtOfLocation.replace(":id", `${idLocation}`)}`);
  };

  const handleEditLocation = (idLocation: number) => {
    navigate(`${routes.admin.locations.districtEdit.replace(":id", `${idLocation}`)}`);
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
      <div className={classes["location-management-container"]}>
        <SideBarWard>
          <Box className={classes["container-body"]}>
            <Box className={classes["search-container"]}>
              <SearchAppBar onSearch={handleSearch} />
              <Button onClick={openFilterDialogHandle} variant='contained'>
                LỌC PHƯỜNG
              </Button>
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
                </Box>
              </Box>
            </Box>
          </Box>
        </SideBarWard>
      </div>

      <Dialog open={Boolean(openFilterDialogValue)} onClose={onCloseFilterDialogHandle}>
        <DialogContent>
          <WardFilter selectedId={searchParamFilter} propertyList={wardList} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DistrictLocationManagement;
