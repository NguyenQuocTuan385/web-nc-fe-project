import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import classes from "./styles.module.scss";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import DistrictService from "services/district";
import { Property } from "models/property";
import WardService from "services/ward";

interface ComponentProps {
  props: JSX.Element;
}
export default function TabPanelFilter({ props }: ComponentProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState<Property | null>(null);
  const [selectedWard, setSelectedWard] = React.useState<Property | null>(null);
  const [districts, setDistricts] = useState<Property[]>([]);
  const [wards, setWards] = useState<Property[]>([]);
  useEffect(() => {
    const getAllDistrict = async () => {
      DistrictService.getAllDistrict({
        search: "",
        pageSize: 999
      })
        .then((res) => {
          setDistricts(res.content);
          return res.content;
        })
        .catch((err: any) => console.log(err));
    };
    getAllDistrict();
  }, []);
  const getAllWard = async (id: Number) => {
    WardService.getAllWardBy(Number(id), {
      search: "",
      pageSize: 999
    })
      .then((res) => {
        setWards(res.content);
        return res.content;
      })
      .catch((err: any) => console.log(err));
  };
  useEffect(() => {
    if (selectedDistrict) {
      getAllWard(selectedDistrict.id);
    }
  }, [selectedDistrict]);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option: Property) => option.name
  });
  const childrenWithProps = React.cloneElement(props, {
    district: selectedDistrict?.id,
    ward: selectedWard?.id,
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
            options={wards}
            getOptionLabel={(option) => option.name}
            sx={{ width: 220 }}
            onChange={(event, newValue) => setSelectedWard(newValue)}
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
