import { Box } from "@mui/material";
import SideBarWard from "components/admin/SidebarWard";
import React from "react";
import TabPanel from "./TabPanel";

import classes from "./styles.module.scss";

function DistrictContractList() {
  return (
    <Box className={classes.boxContainer}>
      <SideBarWard />
      <Box className={classes.rightComponentContainer}>
        <TabPanel />
      </Box>
    </Box>
  );
}

export default DistrictContractList;
