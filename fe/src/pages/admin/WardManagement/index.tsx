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
import SearchAppBar from "components/common/Search";
import TableTemplateDCMS from "components/common/TableTemplateDCMS";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { useLocation, useResolvedPath, createSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import WardService from "services/ward";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const ButtonBack = styled(Button)(() => ({
  paddingLeft: "0 !important",
  "&:hover": {
    backgroundColor: "transparent !important"
  }
}));

export default function WardManagement() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const itemsPerPage = 5;

  const [wardList, setWardList] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [wardId, setWardId] = useState(-1);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [editingWard, setEditingWard] = useState<null | any>(null);

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

  const getAllWardBy = async () => {
    try {
      const res = await WardService.getAllWardBy(Number(id), {
        search: searchValue,
        pageSize: itemsPerPage,
        current: Number(currentPage)
      });

      setWardList(res.content);
      setTotalPage(res.totalPages);
      setTotalElements(res.totalElements);

      navigate({
        pathname: match,
        search: createSearchParams({
          page: currentPage.toString()
        }).toString()
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllWardBy();
  }, [currentPage, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const data = wardList.map((district: any, index: number) => {
    return {
      stt: index + 1,
      id: district.id,
      name: district.name,
      code: district.code
    };
  });

  const customHeading = ["STT", "ID", "Mã phường", "Tên phường"];
  const customColumns = ["stt", "id", "code", "name"];

  const handleEditProperty = (idProperty: number) => {
    setWardId(idProperty);
    setEditPopupOpen(true);
    setEditingWard(wardList.find((ward: any) => ward.id === idProperty));
  };

  const handleDeleteProperty = (idProperty: number) => {
    setWardId(idProperty);
    setOpenDeleteDialog(true);
  };

  const deleteProperty = (idProperty: number) => {
    WardService.deleteWardBy(idProperty)
      .then((res) => {
        getAllWardBy();
      })
      .catch((e) => {
        console.log(e);
      });

    setOpenDeleteDialog(false);
  };

  const handleEditWard = (name: string) => {
    WardService.updateWardBy(wardId, {
      id: wardId,
      name: name,
      code: editingWard.code
    })
      .then((res) => {
        getAllWardBy();
        setEditPopupOpen(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSearch = (query: string) => {
    setSearchValue(query);
  };

  const goBack = () => {
    navigate(routes.admin.properties.district);
  };

  return (
    <div>
      <div className={classes["location-management-container"]}>
        <SidebarDCMS>
          <Box className={classes["container-body"]}>
            <ButtonBack onClick={() => goBack()}>
              <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
              Trở về
            </ButtonBack>
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
            Bạn có thật sự muốn xóa phường này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='error' onClick={closeDeleteDialogHandle}>
            Hủy bỏ
          </Button>
          <Button
            variant='contained'
            onClick={() => deleteProperty(Number(wardId))}
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
            value={editingWard?.name || ""}
            onChange={(e) => setEditingWard({ ...editingWard, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPopupOpen(false)} color='primary'>
            Hủy bỏ
          </Button>
          <Button onClick={() => handleEditWard(editingWard?.name || "")} color='primary' autoFocus>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
