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
import SearchAppBar from "components/common/Search";
import TableTemplateDCMS from "components/common/TableTemplateDCMS";
import AdvertiseTypeService from "services/advertiseType";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { createSearchParams, useLocation, useNavigate, useResolvedPath } from "react-router-dom";
import { AdvertiseType } from "models/advertise";
import useIntercepts from "hooks/useIntercepts";

export default function ReportFormManagement() {
  const customHeading = ["STT", "Tên loại quảng cáo", "Mô tả"];
  const customColumns = ["stt", "name", "description"];
  const itemsPerPage = 5;
  const locationHook = useLocation();
  const navigate = useNavigate();
  const match = useResolvedPath("").pathname;
  const [searchValue, setSearchValue] = useState("");
  const [advertiseType, setAdvertiseType] = useState<AdvertiseType[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);
  const [advertiseTypeId, setAdvertiseTypeId] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

  const intercept = useIntercepts();

  const deleteAdvertiseType = (id: number) => {
    AdvertiseTypeService.deleteAdvertiseTypeById(id, intercept)
      .then(() => {
        getAllAdvertiseType();
        setOpenDeleteDialog(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDeleteAdvertiseType = (id: number) => {
    setAdvertiseTypeId(id);
    setOpenDeleteDialog(true);
  };
  const closeDeleteDialogHandle = () => {
    setOpenDeleteDialog(false);
  };

  const getAllAdvertiseType = async () => {
    try {
      const res = await AdvertiseTypeService.getAllAdvertiseType(
        {
          search: searchValue,
          pageSize: itemsPerPage,
          current: Number(currentPage)
        },
        intercept
      );
      const advertiseType: AdvertiseType[] = res.content;
      setAdvertiseType(advertiseType);
      setTotalPage(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAdvertiseType();
  }, [searchValue, currentPage]);

  const data = advertiseType.map((item, index) => {
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
                  onDeleteClick={handleDeleteAdvertiseType}
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
            Bạn có thật sự muốn xóa loại quảng cáo này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='error' onClick={closeDeleteDialogHandle}>
            Hủy bỏ
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              deleteAdvertiseType(advertiseTypeId);
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
