import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import classes from "./styles.module.scss";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import district from "../../../district.json";

interface District {
  id: number;
  name: string;
  wards: {
    id: number;
    name: string;
  }[];
}
const districts: District[] = district;

interface ComponentProps {
  props: JSX.Element;
}
export default function TabPanelFilter({ props }: ComponentProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState<District | null>(null);

  const [selectedWard, setSelectedWard] = React.useState<District | null>(null);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option: District) => option.name
  });
  const childrenWithProps = React.cloneElement(props, {
    district: selectedDistrict?.name,
    ward: selectedWard?.name,
    fieldSearch: searchValue
  });

  return (
    <>
      <Box className={classes.boxContainer}>
        <Box className={classes.boxTabPanel}>
          <Autocomplete
            id='filter-demo'
            options={districts}
            getOptionLabel={(option) => option.name}
            filterOptions={filterOptions}
            sx={{ width: 200 }}
            onChange={(event, newValue) => {
              setSelectedDistrict(newValue);
              setSelectedWard(null);
            }}
            value={selectedDistrict}
            renderInput={(params) => <TextField {...params} label='Quận' />}
          />
          <Autocomplete
            id='filter-demo'
            options={districts.filter((district) => district.id === selectedDistrict?.id)[0]?.wards}

           
            getOptionLabel={(option) => option.name}
            sx={{ width: 220 }}
            onChange={(event, newValue) => setSelectedWard(newValue as District | null)}
            renderInput={(params) => <TextField {...params} label='Phường' />}
            value={selectedWard}
            disabled={selectedDistrict === null}
          />
          <Button
            variant='contained'
            onClick={() => {
              setSelectedDistrict(null);
              setSelectedWard(null);
            }}
          >
            Xóa Lọc
          </Button>

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
        {childrenWithProps}
      </Box>
    </>
  );
}
