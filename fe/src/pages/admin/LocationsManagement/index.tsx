import React, { useState, useEffect } from "react";
import { Pagination, Box } from "@mui/material";
import { useNavigate, useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import queryString from "query-string";

import classes from "./styles.module.scss";

import SideBarWard from "components/admin/SidebarWard";
import TableTemplate from "components/common/TableTemplate";
import SearchAppBar from "components/common/Search";
import { Header } from "components/common/Header";
import LocationService from "services/location";
import { routes } from "routes/routes";

const LocationManagement = () => {
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
      LocationService.getLocations({
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

  return (
    <Box>
      <Header />
      <div className={classes["location-management-container"]}>
        <SideBarWard></SideBarWard>
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

              <Box className={classes["pagination-custom"]}>
                <span>{`Hiển thị ${Math.min(
                  Number(currentPage) * itemsPerPage,
                  totalElements
                )} kết quả trên ${totalElements}`}</span>
                <Pagination count={totalPage} page={Number(currentPage)} onChange={handleChangePage} />
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default LocationManagement;
