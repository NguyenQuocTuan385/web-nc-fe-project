import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import classes from "./styles.module.scss";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";
import UserManagementTable from "../UserTable";
import ReportTable from "../ReportTable";

export default function TabPanel() {
  const [value, setValue] = React.useState("0");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const locationHook = useLocation();
  const params = new URLSearchParams(locationHook.search);
  const tab = params.get("tab");
  React.useEffect(() => {
    if (tab) {
      setValue(tab);
    }
  }, [tab]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate({
      pathname: locationHook.pathname,
      search: createSearchParams({
        ...(newValue !== "0" && { tab: newValue.toString() })
      }).toString()
    });
    setValue(newValue);
  };

  return (
    <>
      <Box className={classes.boxContainer}>
        <Box className={classes.boxTabPanel}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label='Tất cả' value={"0"} />
            <Tab label='Bảng quảng cáo' value={"ADVERTISE"} />
            <Tab label='Địa điểm' value={"LOCATION"} />
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
        </Box>
        <ReportTable tab={value} fieldSearch={searchValue} />
      </Box>
    </>
  );
}
