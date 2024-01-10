import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ContractTable from "../ContractTable";
import classes from "./styles.module.scss";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import WardFilter from "components/admin/WardFilter";
import { Button, Dialog, DialogContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { openFilterDialog } from "reduxes/Status";
import { string } from "yup";
import DistrictService from "services/district";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/user";
import useIntercepts from "hooks/useIntercepts";
import { Header } from "components/common/Header";

export default function TabPanel() {
  const locationHook = useLocation();
  const dispatch = useDispatch();
  const currentUser: User = useSelector(selectCurrentUser);
  const intercept = useIntercepts();
  const [searchParams, setSearchParams] = useState(() => {
    const params = queryString.parse(locationHook.search);

    if (params.wardFilter !== null) {
      if (Array.isArray(params.wardFilter)) return params.wardFilter;
      else if (Number.isInteger(Number(params.wardFilter))) return [params.wardFilter.toString()];
    }
    return [];
  });
  const [tabValue, setTabValue] = React.useState(() => {
    const params = queryString.parse(locationHook.search);

    return Number(params.status) || 0;
  });
  const [searchValue, setSearchValue] = useState(() => {
    const params = queryString.parse(locationHook.search);

    return params.searchKey || "";
  });
  const openFilterDialogValue = useSelector((state: RootState) => state.status.isOpenFilterDialog);
  const [wardList, setWardList] = useState([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const openFilterDialogHandle = () => {
    dispatch(openFilterDialog(true));
  };

  useEffect(() => {
    DistrictService.getWardWithParentId(currentUser.property.id, intercept)
      .then((res) => {
        setWardList(res.content);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    const params = queryString.parse(locationHook.search);

    if (params.wardFilter === undefined || params.wardFilter === null) setSearchParams([null]);
    else {
      if (Array.isArray(params.wardFilter)) {
        setSearchParams(params?.wardFilter);
      } else if (Number.isInteger(Number(params.wardFilter)))
        setSearchParams([params.wardFilter.toString()]);
    }
  }, [locationHook.search]);

  return (
    <>
      <Box className={classes.boxContainer}>
        <Box className={classes.boxTabPanel}>
          <Tabs value={tabValue} onChange={handleChange}>
            <Tab label='Tất cả' />
            <Tab label='Đã cấp phép' />
            <Tab label='Chưa cấp phép' />
            <Tab label='Đã hết hạn' />
          </Tabs>

          <TextField
            placeholder='Tìm kiếm'
            variant='outlined'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon color='primary' />
                </InputAdornment>
              )
            }}
            onChange={handleSearchChange}
            className={classes.customTextField}
          />
          <Button onClick={openFilterDialogHandle}>LỌC PHƯỜNG</Button>
        </Box>

        <Dialog
          open={Boolean(openFilterDialogValue)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogContent>
            <WardFilter selectedId={searchParams} propertyList={wardList} />
          </DialogContent>
        </Dialog>
        <ContractTable status={Number(tabValue)} fieldSearch={String(searchValue)} />
      </Box>
    </>
  );
}
