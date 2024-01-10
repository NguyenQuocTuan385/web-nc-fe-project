import { Box, Card } from "@mui/material";
import SideBarWard from "components/admin/SidebarWard";
import TabPanel from "./TabPanel";

import classes from "./styles.module.scss";
import { Header } from "components/common/Header";

function ContractList() {
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

export default ContractList;
