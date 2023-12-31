import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogContent, Pagination, TablePagination } from "@mui/material";

import {
  useNavigate,
  useLocation,
  useResolvedPath,
  createSearchParams,
  useSearchParams
} from "react-router-dom";
import queryString from "query-string";

import SideBarWard from "components/admin/SidebarWard";
import TableTemplate from "components/common/TableTemplate";
import SearchAppBar from "components/common/Search";
import { Header } from "components/common/Header";
import classes from "./styles.module.scss";
import ReportService from "services/report";
import { routes } from "routes/routes";
import { useDispatch, useSelector } from "react-redux";
import { openFilterDialog } from "reduxes/Status";
import WardFilter from "components/admin/WardFilter";
import { RootState } from "store";
import useIntercepts from "hooks/useIntercepts";

const DistrictReportsManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const openFilterDialogValue = useSelector((state: RootState) => state.status.isOpenFilterDialog);
  const [reportList, setReportList] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;

  const [currentPage, setCurrentPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.page || 1;
  });

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredId, setFilterdId] = useState(() => {
    const params = queryString.parse(locationHook.search);
    if (params.wardFilter !== null) {
      if (Array.isArray(params.wardFilter)) return params.wardFilter.map(Number);
      else if (Number.isInteger(Number(params.wardFilter))) return [Number(params.wardFilter)];
    }

    return [];
  });
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPageValue: number
  ) => {
    setCurrentPage(newPageValue + 1);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };
  const intercept = useIntercepts();

  useEffect(() => {
    const getAllReports = async () => {
      ReportService.getReportsWithPropertyAndParent(
        {
          propertyId: filteredId,
          parentId: [1],
          search: searchValue,
          pageSize: Number(rowsPerPage),
          current: Number(currentPage)
        },
        intercept
      )
        .then((res) => {
          if (res.content.length === 0) setCurrentPage(1);

          setReportList(res.content);
          setTotalPage(res.totalPages);
          setTotalElements(res.totalElements);

          searchParams.set("page", currentPage.toString());
          searchParams.set("rowsNum", rowsPerPage.toString());
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getAllReports();
  }, [currentPage, searchValue, filteredId, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

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

  const openFilterDialogHandle = () => {
    dispatch(openFilterDialog(true));
  };

  return (
    <Box>
      <Header />
      <div className={classes["reports-management-container"]}>
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
                onEditClick={handleReport}
                onViewDetailsClick={handleViewDetails}
              />

              <Box className={classes["pagination-custom"]}>
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
      </div>

      <Dialog
        open={Boolean(openFilterDialogValue)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <WardFilter
            selectedId={searchParamFilter}
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

export default DistrictReportsManagement;
