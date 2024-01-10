import React, { useState, useEffect } from "react";
import { Box, TablePagination } from "@mui/material";
import { useNavigate, useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import queryString from "query-string";

import classes from "./styles.module.scss";

import SideBarWard from "components/admin/SidebarWard";
import TableTemplate from "components/common/TableTemplate";
import SearchAppBar from "components/common/Search";
import LocationService from "services/location";
import { routes } from "routes/routes";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/user";
import useIntercepts from "hooks/useIntercepts";

const LocationManagement = () => {
  const navigate = useNavigate();
  const currentUser: User = useSelector(selectCurrentUser);

  const [locationList, setLocationList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

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
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPageValue: number
  ) => {
    setCurrentPage(newPageValue + 1);
    // navigate({
    //   pathname: match,
    //   search: createSearchParams({
    //     page: newPageValue.toString()
    //   }).toString()
    // });
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const intercept = useIntercepts();

  useEffect(() => {
    const getAllLocations = async () => {
      LocationService.getLocationsWithPropertyAndParent(
        {
          propertyId: [currentUser.property.id],
          parentId: [currentUser.property.propertyParent?.id].filter(
            (id): id is number => id !== undefined
          ),
          search: searchValue,
          pageSize: Number(rowsPerPage),
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
  }, [currentPage, searchValue, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

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

  const handleViewAds = (idLocation: number) => {
    navigate(`${routes.admin.advertises.wardOfLocation.replace(":id", `${idLocation}`)}`);
  };

  const handleEditLocation = (idLocation: number) => {
    navigate(`${routes.admin.locations.wardEdit.replace(":id", `${idLocation}`)}`);
  };

  const handleSearch = (query: string) => {
    setSearchValue(query);
  };

  return (
    <>
      {/* <Header /> */}
      <Box className={classes["location-management-container"]}>
        <SideBarWard>
          <Box className={classes["container-body"]}>
            <Box className={classes["search-container"]}>
              <SearchAppBar onSearch={handleSearch} />
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

                {/* <Box className={classes["pagination-custom"]}>
                <span>{`Hiển thị ${Math.min(
                  Number(currentPage) * itemsPerPage,
                  totalElements
                )} kết quả trên ${totalElements}`}</span>
                <Pagination
                  count={totalPage}
                  page={Number(currentPage)}
                  onChange={handleChangePage}
                />
              </Box> */}
              </Box>
            </Box>
          </Box>
        </SideBarWard>
      </Box>
    </>
  );
};

export default LocationManagement;
