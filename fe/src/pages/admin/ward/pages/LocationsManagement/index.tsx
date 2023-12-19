import Box from "@mui/material/Box";
import Sidebar from "../../components/common/Sidebar";
import TableTemplate from "../../components/common/TableTemplate";
import InfoAdvertise from "../AdvertisesManagement/components/InfoLocation";

import classes from "./styles.module.scss";

import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import locations from "./locations.json";

const LocationManagement = () => {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const data = locations.map((location: any, index: number) => {
    return {
      stt: index + 1,
      id: location.id,
      address: location.address,
      adsForm: location.adsForm.name,
      planning: location.planning,
    };
  });

  const customHeading = [
    "STT",
    "Mã",
    "Địa chỉ",
    "Hình thức quảng cáo",
    "Tình trạng quy hoạch",
  ];
  const customColumns = ["stt", "id", "address", "adsForm", "planning"];

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const paginatedData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className={classes["location-management-container"]}>
      <Sidebar></Sidebar>
      <Box className={classes["container-body"]}>
        <Box className={classes["table-container"]}>
          <Box className={classes["table-container"]}>
            <TableTemplate
              data={paginatedData}
              customHeading={customHeading}
              customColumns={customColumns}
              isActionColumn={true}
            />

            <Box className={classes["pagination-custom"]}>
              <span>{`Hiển thị ${Math.min(
                page * itemsPerPage,
                data.length
              )} kết quả ${data.length}`}</span>
              <Pagination
                count={Math.ceil(data.length / itemsPerPage)}
                page={page}
                onChange={handleChange}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default LocationManagement;
