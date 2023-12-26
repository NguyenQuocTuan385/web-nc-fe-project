import React, { useState, useEffect } from "react";
import { Box, Pagination } from "@mui/material";

import { useNavigate, useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import queryString from "query-string";

import SideBarWard from "components/admin/SidebarWard";
import TableTemplate from "components/common/TableTemplate";
import SearchAppBar from "components/common/Search";
import { Header } from "components/common/Header";
import classes from "./styles.module.scss";
import ReportService from "services/report";
import { routes } from "routes/routes";

const ReportsManagement = () => {
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const [reportList, setReportList] = useState([]);

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
    const getAllReports = async () => {
      ReportService.getReports({ search: searchValue, pageSize: itemsPerPage, current: Number(currentPage) })
        .then((res) => {
          setReportList(res.content);
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
    getAllReports();
  }, [currentPage, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const data = reportList.map((report: any, index: number) => {
    return {
      stt: index + 1,
      objectStatus: { value: report.status, name: report.status ? "Đã xử lí" : "Chưa xử lí" },
      ...report
    };
  });

  const customHeading = ["STT", "Mã", "Email", "Tên", "Điện thoại", "Tình trạng xử lý"];
  const customColumns = ["stt", "id", "email", "fullName", "phone", "objectStatus"];

  const handleSearch = (query: string) => {
    setSearchValue(query);
  };
  // const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleReport = (idReport: number) => {
    navigate(`${routes.admin.reports.edit.replace(":id", `${idReport}`)}`);
  };

  const handleViewDetails = (idReport: number) => {
    navigate(`${routes.admin.reports.details.replace(":id", `${idReport}`)}`);
  };

  return (
    <Box>
      <Header />
      <div className={classes["reports-management-container"]}>
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
                onEditClick={handleReport}
                onViewDetailsClick={handleViewDetails}
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

export default ReportsManagement;
