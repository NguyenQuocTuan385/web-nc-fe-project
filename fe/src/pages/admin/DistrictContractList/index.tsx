import { Box } from "@mui/material";
import SideBarWard from "components/admin/SidebarWard";
import React from "react";
import TabPanel from "./TabPanel";

import classes from "./styles.module.scss";
import { Header } from "components/common/Header";

function DistrictContractList() {
  return (
    <Box className={classes.boxContainer}>
      <Header />
      <SideBarWard />
      <Box className={classes.rightComponentContainer}>
        <TabPanel />
      </Box>
    </Box>
  );
}

export default DistrictContractList;
