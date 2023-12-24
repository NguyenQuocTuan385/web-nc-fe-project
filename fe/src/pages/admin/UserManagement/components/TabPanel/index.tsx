import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import UserManagementTable from "../UserTable";
import classes from "./styles.module.scss";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";

export default function TabPanel() {
  const [value, setValue] = React.useState(0);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const locationHook = useLocation();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate({
      pathname: locationHook.pathname,
      search: createSearchParams({
        role: newValue.toString()
      }).toString()
    });
    setValue(newValue);
  };

  return (
    <>
      <Box className={classes.boxContainer}>
        <Box className={classes.boxTabPanel}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label='Tất cả' value={0} />
            <Tab label='Quận' value={3} />
            <Tab label='Phường' value={2} />
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
        <UserManagementTable role={value} fieldSearch={searchValue} />
      </Box>
    </>
  );
}
