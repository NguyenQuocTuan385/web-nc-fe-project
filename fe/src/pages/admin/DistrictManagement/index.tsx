import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  TextField
} from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import SearchAppBar from "components/common/SearchDCMS";
import TableTemplateDCMS from "components/common/TableTemplateDCMS";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import DistrictService from "services/district";
import { routes } from "routes/routes";

export default function DistrictManagement() {
  const navigate = useNavigate();
  const itemsPerPage = 5;

  const [districtList, setDistrictList] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [disstrictId, setDistrictId] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<null | any>(null);

  const locationHook = useLocation();
  const match = useResolvedPath("").pathname;

  const [currentPage, setCurrentPage] = useState(() => {
    const params = queryString.parse(locationHook.search);
    return params.page || 1;
  });

  const closeDeleteDialogHandle = () => {
    setOpenDeleteDialog(false);
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

  const getAllDistricts = async () => {
    DistrictService.getAllDistrict({
      search: searchValue,
      pageSize: itemsPerPage,
      current: Number(currentPage)
    })
      .then((res) => {
        setDistrictList(res.content);
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

  useEffect(() => {
    getAllDistricts();
  }, [currentPage, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const data = districtList.map((district: any, index: number) => {
    return {
      stt: index + 1,
      id: district.id,
      city: "Thành phố Hồ Chí Minh",
      name: district.name,
      code: district.code
    };
  });

  const customHeading = ["STT", "Tên quận", "Thành phố"];
  const customColumns = ["stt", "name", "city"];

  const handleViewWard = (idProperty: number) => {
    navigate(`${routes.admin.properties.ward.replace(":id", idProperty.toString())}`);
  };

  const handleEditProperty = (idProperty: number) => {
    setDistrictId(idProperty);
    setEditPopupOpen(true);
    const ward = districtList.find((d: any) => d.id === idProperty);
    setEditingDistrict(ward);
  };
  const handleDeleteProperty = (idProperty: number) => {
    setDistrictId(idProperty);
    setOpenDeleteDialog(true);
  };

  const deleteProperty = (idProperty: number) => {
    DistrictService.deleteDistrict(idProperty)
      .then((res) => {
        getAllDistricts();
        setOpenDeleteDialog(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleEditDistrict = (name: string) => {
    DistrictService.updateDistrict(disstrictId, {
      id: disstrictId,
      name: name,
      code: editingDistrict.code
    })
      .then((res) => {
        getAllDistricts();
        setEditPopupOpen(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSearch = (query: string) => {
    setSearchValue(query);
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
                  onViewWardInDistrictClick={handleViewWard}
                  onEditClick={handleEditProperty}
                  onDeleteClick={handleDeleteProperty}
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
            Bạn có thật sự muốn xóa quận này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='error' onClick={closeDeleteDialogHandle}>
            Hủy bỏ
          </Button>
          <Button
            variant='contained'
            onClick={() => deleteProperty(Number(disstrictId))}
            autoFocus
            color='success'
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={editPopupOpen}
        onClose={() => setEditPopupOpen(false)}
        aria-labelledby='edit-dialog-title'
      >
        <DialogTitle id='edit-dialog-title'>Chỉnh sửa quận</DialogTitle>
        <DialogContent>
          <TextField
            label='Tên mới'
            variant='outlined'
            fullWidth
            value={editingDistrict?.name || ""}
            onChange={(e) => setEditingDistrict({ ...editingDistrict, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPopupOpen(false)} color='primary'>
            Hủy bỏ
          </Button>
          <Button
            onClick={() => handleEditDistrict(editingDistrict?.name || "")}
            color='primary'
            autoFocus
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
