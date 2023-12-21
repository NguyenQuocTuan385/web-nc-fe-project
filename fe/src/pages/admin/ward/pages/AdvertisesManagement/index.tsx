import Box from "@mui/material/Box";
import Sidebar from "../../components/common/Sidebar";
import TableTemplate from "../../components/common/TableTemplate";
import InfoLocation from "./components/InfoLocation";

import classes from "./styles.module.scss";

import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import advertises from "./advertises.json";
import { Location } from "../../models/Location.model";
import { Header } from "../../components/common/Header";
import SearchAppBar from "../../components/common/Search";

const AdvertiseManagement = () => {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const data = advertises.map((ads: any, index: number) => {
    return {
      stt: index + 1,
      id: ads.id,
      adsType: ads.adsType.name,
      adsForm: ads.location.adsForm.name,
      size: ads.width + "m x " + ads.height + "m",
      licensing: ads.licensing
    };
  });

  const customHeading = ["STT", "Mã", "Loại bảng quảng cáo", "Tên loại hình", "Kích thước", "Trạng thái"];
  const customColumns = ["stt", "id", "adsType", "adsForm", "size", "licensing"];

  const dataInfoLocation: Location = advertises.map((ads: any, index: number) => {
    return {
      stt: index,
      id: ads.location.id,
      address: ads.location.address,
      adsForm: ads.location.adsForm.name,
      planning: ads.location.planning,
      locationType: ads.location.locationType.name,
      latitude: ads.location.latitude,
      longtitude: ads.location.longtitude
    };
  })[0];

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box>
      <Header />
      <div className={classes["advertise-management-container"]}>
        <Sidebar></Sidebar>
        <Box className={classes["container-body"]}>
          <Box className={classes["search-container"]}>
            <SearchAppBar />
          </Box>
          <Box>
            <InfoLocation data={dataInfoLocation}></InfoLocation>
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

export default AdvertiseManagement;
