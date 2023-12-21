import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ContractTable from "../ContractTable";
import classes from "./styles.module.scss";
import { Contract } from "models/contract";
import contractData from "../Contractdata.json";
import ContractService from "services/contract";

interface Pageable {
  totalPage: number;
  currentPage: number;
  pageSize: number;
  numberOfElements: number;
}

export default function TabPanel() {
  const [tabValue, setTabValue] = React.useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [tempDataList, setTempDataList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const getContractList = async () => {
      ContractService.getContracts({ pageSize: 5, current: 2 })
        .then((res) => {
          console.log(res.content);
          setTempDataList(res.content);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    getContractList();
  }, []);

  return (
    <>
      <Box className={classes.boxContainer}>
        <Box className={classes.boxTabPanel}>
          <Tabs value={tabValue} onChange={handleChange}>
            <Tab label="Tất cả" />
            <Tab label="Đã cấp phép" />
            <Tab label="Chưa cấp phép" />
          </Tabs>

          <TextField
            placeholder="Tìm kiếm"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
            onChange={handleSearchChange}
            className={classes.customTextField}
          />
        </Box>

        <ContractTable
          totalPage={totalPage}
          numberOfElements={numberOfElements}
          currentPage={currentPage}
          pageSize={pageSize}
          dataList={tempDataList}
          status={tabValue}
          fieldSearch={searchValue}
        />
      </Box>
    </>
  );
}
