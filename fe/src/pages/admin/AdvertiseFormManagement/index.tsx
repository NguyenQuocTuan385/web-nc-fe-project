import { Box } from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import AdvertiseFormTable from "./components/AdvertiseFormTable";
import TabPanelAdvertiseFormSearch from "./components/TabPanelAdvertiseFormSearch";

export default function ReportFormManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarDCMS />
        <TabPanelAdvertiseFormSearch props={<AdvertiseFormTable />} />
      </Box>
    </div>
  );
}
