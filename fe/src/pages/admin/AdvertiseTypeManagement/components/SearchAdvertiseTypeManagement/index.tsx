import * as React from "react";
import {
  styled,
  alpha,
  Box,
  Button,
  InputBase,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";

import classes from "./styles.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useIntercepts from "hooks/useIntercepts";
import AdvertiseFormService from "services/advertiseForm";
import AdvertiseTypeService from "services/advertiseType";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto"
  }
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch"
      }
    }
  },
  border: "1px solid var(--blue-500)",
  borderRadius: "8px"
}));

const ButtonDownload = styled(Button)(() => ({
  backgroundColor: "var(--blue-500)",
  color: "#fff",
  padding: "0 10px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "var(--blue-600)",
    color: "var(--blue-100)"
  }
}));

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

const FormActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: "flex-end"
}));

export default function SearchAppBar({ onSearch }: any) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const methods = useForm();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };
  const handleCreate = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const intercept = useIntercepts();

  const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
    AdvertiseTypeService.createAdvertiseType(
      {
        name: data.name,
        description: data.description
      },
      intercept
    )
      .then((res) => {
        navigate(`${routes.admin.advertiseType.root}`);
        window.location.reload();
        setIsDialogOpen(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Box className={classes["search-wrapper"]}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder='Search…'
          inputProps={{ "aria-label": "search" }}
          onChange={handleSearchChange}
        />
      </Search>

      <ButtonDownload
        size='small'
        sx={{ height: "39px", padding: "0 12px" }}
        onClick={handleCreate}
      >
        <FontAwesomeIcon width={"20px"} height={"20px"} icon={faSquarePlus} color='#fff' />
        <span style={{ marginLeft: "2px" }}>Thêm</span>
      </ButtonDownload>

      <DialogWrapper open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Thêm loại quảng cáo</DialogTitle>
        <FormWrapper {...methods} onSubmit={methods.handleSubmit(handleFormSubmit)}>
          <TextField
            {...methods.register("name", { required: "Tên loại báo cáo không được để rỗng" })}
            label='Tên loại quảng cáo'
            fullWidth
            error={Boolean(methods.formState.errors?.name)}
          />
          <TextField
            {...methods.register("description", { required: "Mô tả không được để rỗng" })}
            label='Mô tả'
            multiline
            rows={4}
            fullWidth
            placeholder='Nhập mô tả'
            defaultValue=''
            error={Boolean(methods.formState.errors?.description)}
          />
          <FormActions>
            <Button type='submit' variant='contained' color='primary'>
              Tạo
            </Button>
            <Button type='button' onClick={handleCloseDialog}>
              Hủy
            </Button>
          </FormActions>
        </FormWrapper>
      </DialogWrapper>
    </Box>
  );
}
