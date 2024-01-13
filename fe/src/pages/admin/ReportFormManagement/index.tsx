import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination
} from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import SearchAppBar from "components/common/SearchDCMS";
import TableTemplateDCMS from "components/common/TableTemplateDCMS";
import { useEffect, useState } from "react";
import ReportFormService from "services/reportForm";
import queryString from "query-string";
import { createSearchParams, useLocation, useNavigate, useResolvedPath } from "react-router-dom";
import { ReportForm } from "models/report";
import useIntercepts from "hooks/useIntercepts";

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reportFormId, setReportFormId] = useState(0);

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
      const res = await ReportFormService.getAllReportForm(
        {
          search: searchValue,
          pageSize: itemsPerPage,
          current: Number(currentPage)
        },
        intercept
      );
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

  const closeDeleteDialogHandle = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteReportForm = (id: number) => {
    setReportFormId(id);
    setOpenDeleteDialog(true);
  };

  const intercept = useIntercepts();

  const deleteReportForm = (id: number) => {
    ReportFormService.deleteReportFormById(id, intercept)
      .then(() => {
        getAllReportForm();
        setOpenDeleteDialog(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
                  onDeleteClick={handleDeleteReportForm}
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
      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDialogHandle}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Lưu ý"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn có thật sự muốn xóa hình thức báo cáo này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='error' onClick={closeDeleteDialogHandle}>
            Hủy bỏ
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              deleteReportForm(reportFormId);
            }}
            autoFocus
            color='success'
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
