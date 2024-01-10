import { Box, Pagination } from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import SearchAppBar from "components/common/Search";
import TableTemplateDCMS from "components/common/TableTemplateDCMS";
import { useEffect, useState } from "react";
import ReportFormService from "services/reportForm";
import queryString from "query-string";
import { createSearchParams, useLocation, useNavigate, useResolvedPath } from "react-router-dom";
import { ReportForm } from "models/report";

export default function ReportFormManagement() {
  const customHeading = ["STT", "Tên hình thức báo cáo", "Mô tả"];
  const customColumns = ["stt", "name", "description"];
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;
  const [searchValue, setSearchValue] = useState("");
  const [reportForm, setReportForm] = useState<ReportForm[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);

  const [currentPage, setCurrentPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.page || 1;
  });
  const handleSearch = (query: string) => {
    setSearchValue(query);
  };

const handleChangePage = (event: React.ChangeEvent<unknown>, newPageValue: number) => {
    setCurrentPage(newPageValue);
    navigate({
      pathname: match,
      search: createSearchParams({
        page: newPageValue.toString()
      }).toString()
    });
  };

  const getAllReportForm = async () => {
    try {
      const res = await ReportFormService.getAllReportForm({
        search: searchValue,
        pageSize: itemsPerPage,
        current: Number(currentPage)
      });
      const reportForm: ReportForm[] = res.content;
      setReportForm(reportForm);
      setTotalPage(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllReportForm();
  }, [searchValue, currentPage]);

  const data = reportForm.map((item, index) => {
    return {
      stt: index + 1,
      id: item.id,
      name: item.name,
      description: item.description
    };
  });

  return (
    <div>
      <div className={classes["location-management-container"]}>
        <SidebarDCMS>
          <Box className={classes["container-body"]}>
            <Box className={classes["search-container"]}>
              <SearchAppBar onSearch={handleSearch} />
            </Box>
            <Box className={classes["table-container"]}>
              <Box className={classes["table-container"]}>
                <TableTemplateDCMS
                  data={data}
                  customHeading={customHeading}
                  customColumns={customColumns}
                  isActionColumn={true}
                  // onEditClick={handleEditProperty}
                  // onDeleteClick={handleDeleteProperty}
                />

                <Box className={classes["pagination-custom"]}>
                  <span>{`Hiển thị ${Math.min(
                    Number(currentPage) * itemsPerPage,
                    totalElements
                  )} kết quả trên ${totalElements}`}</span>
                  <Pagination
                    count={totalPage}
                    page={Number(currentPage)}
                    onChange={handleChangePage}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </SidebarDCMS>
      </div>
    </div>
  );
}
