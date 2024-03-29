import React, { useState, useEffect } from "react";
import { Box, Pagination, TablePagination } from "@mui/material";

import { useNavigate, useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import queryString from "query-string";

import SideBarWard from "components/admin/SidebarWard";
import TableTemplate from "components/common/TableTemplate";
import SearchAppBar from "components/common/Search";
import classes from "./styles.module.scss";
import ReportService from "services/report";
import { routes } from "routes/routes";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/user";
import useIntercepts from "hooks/useIntercepts";
import { EReportType, Report } from "models/report";
import { DateHelper } from "helpers/date";
import { loading } from "reduxes/Loading";

const ReportsManagement = () => {
  const navigate = useNavigate();
  const currentUser: User = useSelector(selectCurrentUser);
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
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.rowsNum || 5;
  });
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
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllReports = async () => {
      dispatch(loading(true));
      ReportService.getReportsWithPropertyAndParent(
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
        })
        .finally(() => {
          dispatch(loading(false));
        });
    };
    getAllReports();
  }, [currentPage, searchValue, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const data = reportList.map((report: Report, index: number) => {
    let statusName;
    if (report.status === 1) {
      statusName = "Chờ xử lý";
    } else if (report.status === 2) {
      statusName = "Đang xử lí";
    } else {
      statusName = "Đã xử lí";
    }
    return {
      ...report,
      stt: (Number(currentPage) - 1) * Number(rowsPerPage) + index + 1,
      objectStatus: { value: report.status, name: statusName },
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
    navigate(`${routes.admin.reports.wardEdit.replace(":id", `${idReport}`)}`);
  };

  const handleViewDetails = (idReport: number) => {
    navigate(`${routes.admin.reports.wardDetails.replace(":id", `${idReport}`)}`);
  };

  return (
    <Box>
      {/* <Header /> */}
      <div className={classes["reports-management-container"]}>
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
                  onEditClick={handleReport}
                  onViewDetailsClick={handleViewDetails}
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

                <Box className={classes["pagination-custom"]}>
                  {/* <span>{`Hiển thị ${Math.min(
                  Number(currentPage) * rowsPerPage,
                  totalElements
                )} kết quả trên ${totalElements}`}</span> */}
                  {/* <Pagination
                  count={totalPage}
                  page={Number(currentPage)}
                  onChange={handleChangePage}
                /> */}
                </Box>
              </Box>
            </Box>
          </Box>
        </SideBarWard>
      </div>
    </Box>
  );
};

export default ReportsManagement;
