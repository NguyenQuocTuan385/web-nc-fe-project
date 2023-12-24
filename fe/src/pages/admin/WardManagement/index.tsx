import { Box } from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import TabPanelWardSearch from "./components/TabPanelWardSearch";
import WardTable from "./components/WardTable";

export default function WardManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarDCMS />
        <TabPanelWardSearch props={<WardTable />} />
      </Box>
    </div>
  );
}
