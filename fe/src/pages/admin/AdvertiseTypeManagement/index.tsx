import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  TextField,
  styled
} from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import SearchAppBar from "./components/SearchAdvertiseTypeManagement";
import TableTemplateDCMS from "components/common/TableTemplateDCMS";
import AdvertiseTypeService from "services/advertiseType";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { createSearchParams, useLocation, useNavigate, useResolvedPath } from "react-router-dom";
import { AdvertiseType } from "models/advertise";
import useIntercepts from "hooks/useIntercepts";
import React from "react";
import { set, useForm } from "react-hook-form";

const DialogWrapper = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.shape.borderRadius
  }
}));

const FormWrapper = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2)
}));

const FormActions = styled(DialogActions)(() => ({
  justifyContent: "flex-end"
}));

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

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const methods = useForm();

  const handleFormSubmit = (data: any) => {
    const advertiseForm = {
      name: data.name,
      description: data.description
    };
    AdvertiseTypeService.updateAdvertiseTypeById(advertiseTypeId, advertiseForm, intercept)
      .then(() => {
        getAllAdvertiseType();
        setIsDialogOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCloseDialog = () => {
    setAdvertiseTypeIdEdit(null);
    setIsDialogOpen(false);
  };

  const [advertiseFormIdEdit, setAdvertiseTypeIdEdit] = useState<any | null>(null);
  const handleEditAdvertiseType = (id: number) => {
    setAdvertiseTypeId(id);
    const adsType = advertiseType.find((item) => item.id === id);
    setAdvertiseTypeIdEdit(adsType);
    setIsDialogOpen(true);
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
                  onEditClick={handleEditAdvertiseType}
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
      <DialogWrapper open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Chỉnh sửa hình thức quảng cáo</DialogTitle>
        <FormWrapper {...methods} onSubmit={methods.handleSubmit(handleFormSubmit)}>
          <TextField
            {...methods.register("name", { required: "Tên loại quảng cáo không được để rỗng" })}
            label='Tên loại quảng cáo '
            fullWidth
            defaultValue={advertiseFormIdEdit?.name}
            error={Boolean(methods.formState.errors?.name)}
          />
          <TextField
            {...methods.register("description", { required: "Mô tả không được để rỗng" })}
            label='Mô tả'
            multiline
            rows={4}
            fullWidth
            placeholder='Nhập mô tả'
            defaultValue={advertiseFormIdEdit?.description}
            error={Boolean(methods.formState.errors?.description)}
          />
          <FormActions>
            <Button type='submit' variant='contained' color='primary'>
              Cập nhập
            </Button>
            <Button type='button' onClick={handleCloseDialog}>
              Hủy
            </Button>
          </FormActions>
        </FormWrapper>
      </DialogWrapper>
    </div>
  );
}
