import Box from "@mui/material/Box";
import Sidebar from "../../components/common/Sidebar";
import TableTemplate from "../../components/common/TableTemplate";
import reports from "./reports.json";
import classes from "./styles.module.scss";

import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import SearchAppBar from "../../components/common/Search";
import { Button, IconButton } from "@mui/material";

import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Header } from "../../components/common/Header";

const ReportsManagement = () => {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const data = reports.map((report: any, index: number) => {
    return {
      stt: index + 1,
      statusObject: [report.status, report.status ? "Đã xử lí" : "Chưa xử lí"],
      ...report
    };
  });

  const customHeading = ["STT", "Mã", "Email", "Tên", "Điện thoại", "Tình trạng"];
  const customColumns = ["stt", "id", "email", "fullName", "phone", "statusObject"];

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box>
      <Header />
      <div className={classes["reports-management-container"]}>
        <Sidebar></Sidebar>
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

export default ReportsManagement;
