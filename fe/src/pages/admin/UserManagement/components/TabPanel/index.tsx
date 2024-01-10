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
import SideBarDCMS from "components/admin/SidebarDCMS";

export default function TabPanel() {
  const [value, setValue] = React.useState(0);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const locationHook = useLocation();
  const params = new URLSearchParams(locationHook.search);
  const role = params.get("roleId");
  React.useEffect(() => {
    if (role) {
      setValue(Number(role));
    }
  }, [role]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate({
      pathname: locationHook.pathname,
      search: createSearchParams({
        ...(newValue !== 0 && { roleId: newValue.toString() })
      }).toString()
    });
    setValue(newValue);
  };

  return (
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
  );
}
