import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogContent, TablePagination } from "@mui/material";

import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import queryString from "query-string";

import SideBarWard from "components/admin/SidebarWard";
import TableTemplate from "components/common/TableTemplate";
import SearchAppBar from "components/common/Search";
import classes from "./styles.module.scss";
import ReportService from "services/report";
import { routes } from "routes/routes";
import { useDispatch, useSelector } from "react-redux";
import { openFilterDialog } from "reduxes/Status";
import WardFilter from "components/admin/WardFilter";
import { RootState } from "store";
import useIntercepts from "hooks/useIntercepts";
import DistrictService from "services/district";
import { User } from "models/user";
import { selectCurrentUser } from "reduxes/Auth";
import { EReportType, Report } from "models/report";
import { DateHelper } from "helpers/date";

const DistrictReportsManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const openFilterDialogValue = useSelector((state: RootState) => state.status.isOpenFilterDialog);
  const [reportList, setReportList] = useState([]);
  const currentUser: User = useSelector(selectCurrentUser);
  const [searchValue, setSearchValue] = useState("");
  const locationHook = useLocation();

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
  const [wardList, setWardList] = useState([]);

  useEffect(() => {
    DistrictService.getWardWithParentId(currentUser.property.id, intercept)
      .then((res) => {
        setWardList(res.content);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    const getAllReports = async () => {
      ReportService.getReportsWithPropertyAndParent(
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

          setReportList(res.content);
          setTotalPage(res.totalPages);
          setTotalElements(res.totalElements);

          searchParams.set("page", currentPage.toString());
          searchParams.set("rowsNum", rowsPerPage.toString());
          setSearchParams(searchParams);
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

  const data = reportList.map((report: Report, index: number) => {
    return {
      ...report,
      stt: (Number(currentPage) - 1) * Number(rowsPerPage) + index + 1,
      objectStatus: { value: report.status, name: report.status ? "Đã xử lí" : "Chưa xử lí" },
      reportTypeName:
        report.reportTypeName === EReportType.ADVERTISE ? "Bảng quảng cáo" : "Điểm đặt quảng cáo",
      createdAt: DateHelper.formatDateToDDMMYYYY(report.createdAt),
      address:
        report.reportTypeName === EReportType.LOCATION
          ? report.address
          : report.advertise?.location.address
    };
  });

  const customHeading = [
    "STT",
    "Loại báo cáo",
    "Email",
    "Tên",
    "Địa chỉ",
    "Thời điểm gửi",
    "Tình trạng xử lý"
  ];
  const customColumns = [
    "stt",
    "reportTypeName",
    "id",
    "email",
    "fullName",
    "address",
    "createdAt",
    "objectStatus"
  ];

  const handleSearch = (query: string) => {
    setSearchValue(query);
  };
  // const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleReport = (idReport: number) => {
    navigate(`${routes.admin.reports.districtEdit.replace(":id", `${idReport}`)}`);
  };

  const handleViewDetails = (idReport: number) => {
    navigate(`${routes.admin.reports.districtDetails.replace(":id", `${idReport}`)}`);
  };

  const openFilterDialogHandle = () => {
    dispatch(openFilterDialog(true));
  };

  const onCloseFilterDialogHandle = () => {
    dispatch(openFilterDialog(false));
  };

  return (
    <Box>
      <div className={classes["reports-management-container"]}>
        <SideBarWard>
          <Box className={classes["container-body"]}>
            <Box className={classes["search-container"]}>
              <SearchAppBar onSearch={handleSearch} />
              <Button onClick={openFilterDialogHandle} variant='contained' sx={{ height: "39px" }}>
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
                    className={classes.pagination}
                  />
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

export default DistrictReportsManagement;
