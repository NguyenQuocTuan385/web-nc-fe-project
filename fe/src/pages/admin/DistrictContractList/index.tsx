import { Box, Card } from "@mui/material";
import SideBarWard from "components/admin/SidebarWard";
import React from "react";
import TabPanel from "./TabPanel";

import classes from "./styles.module.scss";

function DistrictContractList() {
  return (
    <Box className={classes.boxContainer}>
      <SideBarWard>
        <Card className={classes.rightComponentContainer}>
          <TabPanel />
        </Card>
      </SideBarWard>
    </Box>
  );
}

export default DistrictContractList;
