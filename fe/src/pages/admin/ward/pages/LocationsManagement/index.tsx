import Box from "@mui/material/Box";
import SideBarWard from "components/admin/SidebarWard";
import TableTemplate from "../../components/common/TableTemplate";
import InfoAdvertise from "../AdvertisesManagement/components/InfoLocation";

import classes from "./styles.module.scss";

import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import locations from "./locations.json";
import SearchAppBar from "../../components/common/Search";
import { Button, IconButton } from "@mui/material";

import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Header } from "../../components/common/Header";

const LocationManagement = () => {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const data = locations.map((location: any, index: number) => {
    return {
      stt: index + 1,
      id: location.id,
      address: location.address,
      adsForm: location.adsForm.name,
      planning: location.planning
    };
  });

  const customHeading = ["STT", "Mã", "Địa chỉ", "Hình thức quảng cáo", "Tình trạng quy hoạch"];
  const customColumns = ["stt", "id", "address", "adsForm", "planning"];

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box>
      <Header />
      <div className={classes["location-management-container"]}>
        <SideBarWard></SideBarWard>
        <Box className={classes["container-body"]}>
          <Box className={classes["search-container"]}>
            <SearchAppBar />
          </Box>
          <Box className={classes["table-container"]}>
            <Box className={classes["table-container"]}>
              <TableTemplate
                data={paginatedData}
                customHeading={customHeading}
                customColumns={customColumns}
                isActionColumn={true}
              />

              <Box className={classes["pagination-custom"]}>
                <span>{`Hiển thị ${Math.min(page * itemsPerPage, data.length)} kết quả trên ${data.length}`}</span>
                <Pagination count={Math.ceil(data.length / itemsPerPage)} page={page} onChange={handleChange} />
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default LocationManagement;
