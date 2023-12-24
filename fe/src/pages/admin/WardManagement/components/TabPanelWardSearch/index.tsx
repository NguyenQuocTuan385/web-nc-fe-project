import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import classes from "./styles.module.scss";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

interface ComponentProps {
  props: JSX.Element;
}
export default function TabPanelFilter({ props }: ComponentProps) {
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const childrenWithProps = React.cloneElement(props, {
    fieldSearch: searchValue
  });

  return (
    <>
      <Box className={classes.boxContainer}>
        <Box className={classes.boxTabPanel}>
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
          <Button variant='contained' color='primary'>
            Thêm Quận
          </Button>
        </Box>
        {childrenWithProps}
      </Box>
    </>
  );
}
