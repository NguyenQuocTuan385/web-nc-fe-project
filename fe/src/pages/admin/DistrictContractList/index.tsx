import { Box } from "@mui/material";
import SideBarWard from "components/admin/SidebarWard";
import React from "react";
import TabPanel from "./TabPanel";

import classes from "./styles.module.scss";
import { Header } from "components/common/Header";
import SideBarDistrict from "components/admin/SidebarDistrict";

function DistrictContractList() {
  return (
    <Box className={classes.boxContainer}>
      <Header />
      <SideBarDistrict />
      <Box className={classes.rightComponentContainer}>
        <TabPanel />
      </Box>
    </Box>
  );
}

export default DistrictContractList;
