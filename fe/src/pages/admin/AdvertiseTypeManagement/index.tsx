import { Box } from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import AdvertiseTypeTable from "./components/AdvertiseTypeTable";
import TabPanelAdvertiseTypeSearch from "./components/TabPanelAdvertiseTypeSearch";

export default function ReportFormManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarDCMS />
        <TabPanelAdvertiseTypeSearch props={<AdvertiseTypeTable />} />
      </Box>
    </div>
  );
}
