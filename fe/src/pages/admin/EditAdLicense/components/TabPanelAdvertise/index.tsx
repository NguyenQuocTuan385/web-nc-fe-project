import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import classes from "./styles.module.scss";
import TabPanelFilter from "../../../../../components/admin/TabPanelFilter";
import EditAdTableLicense from "../EditAdTableLicense";
import EditAdLocationLicense from "../EditAdLocationLicense";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";

export default function TabPanelAdvertise() {
  const [value, setValue] = useState("-1");
  const navigate = useNavigate();
  const locationHook = useLocation();
  const params = new URLSearchParams(locationHook.search);
  const tab = params.get("tab");
  React.useEffect(() => {
    if (tab) {
      setValue(tab);
    } else {
      setValue("1");
    }
  }, [tab]);

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
    <Box className={classes.boxContainer}>
      <TabContext value={value.toString()}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab label='Điểm đặt' value='1' />
            <Tab label='Bảng' value='2' />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <TabPanelFilter props={<EditAdLocationLicense />} />
        </TabPanel>
        <TabPanel value='2'>
          <TabPanelFilter props={<EditAdTableLicense />} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
