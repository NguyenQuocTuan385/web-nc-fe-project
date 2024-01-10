import { Box } from "@mui/material";
import SideBarWard from "components/admin/SidebarWard";
import TabPanel from "./TabPanel";

import classes from "./styles.module.scss";
import { Header } from "components/common/Header";

function ContractList() {
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

export default ContractList;
