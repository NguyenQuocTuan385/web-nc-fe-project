import { Box } from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import TabPanelFilter from "components/admin/TabPanelFilter";
import WardTable from "./components/WardTable";

export default function WardManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarDCMS />
        <TabPanelFilter props={<WardTable />} />
      </Box>
    </div>
  );
}
