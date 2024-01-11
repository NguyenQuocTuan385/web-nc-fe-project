import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import SearchAppBar from "components/common/Search";
import TableTemplateDCMS from "components/common/TableTemplateDCMS";
import { createSearchParams, useLocation, useNavigate, useResolvedPath } from "react-router-dom";
import { useEffect, useState } from "react";
import queryString from "query-string";
import AdvertiseFormService from "services/advertiseForm";
import { AdvertiseForm } from "models/advertise";
import useIntercepts from "hooks/useIntercepts";

export default function ReportFormManagement() {
  const customHeading = ["STT", "Tên hình thức quảng cáo", "Mô tả"];
  const customColumns = ["stt", "name", "description"];
  const itemsPerPage = 5;
  const locationHook = useLocation();
  const navigate = useNavigate();
  const match = useResolvedPath("").pathname;
  const [searchValue, setSearchValue] = useState("");
  const [advertiseForm, setAdvertiseForm] = useState<AdvertiseForm[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);

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

  const [currentPage, setCurrentPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.page || 1;
  });

  const getAllAdvertiseForm = async () => {
    try {
      const res = await AdvertiseFormService.getAllAdvertiseForm({
        search: searchValue,
        pageSize: itemsPerPage,
        current: Number(currentPage)
      });
      const advertiseForm: AdvertiseForm[] = res.content;
      setAdvertiseForm(advertiseForm);
      setTotalPage(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAdvertiseForm();
  }, [searchValue, currentPage]);
  
  const data = advertiseForm.map((item, index) => {
    return {
      stt: index + 1,
      id: item.id,
      name: item.name,
      description: item.description
    };
  });

   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [advertiseFormId, setAdvertiseFormId] = useState(0);


  const intercept = useIntercepts();

  const deleteAdvertiseForm = (id: number) => {
    AdvertiseFormService.deleteAdvertiseFormById(id, intercept)
      .then(() => {
        getAllAdvertiseForm();
        setOpenDeleteDialog(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDeleteAdvertiseForm = (id: number) => {
    setAdvertiseFormId(id);
    setOpenDeleteDialog(true);
  };
  const closeDeleteDialogHandle = () => {
    setOpenDeleteDialog(false);
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
                  onDeleteClick={handleDeleteAdvertiseForm}
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
            Bạn có thật sự muốn xóa hình thức quảng cáo này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='error' onClick={closeDeleteDialogHandle}>
            Hủy bỏ
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              deleteAdvertiseForm(advertiseFormId);
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
