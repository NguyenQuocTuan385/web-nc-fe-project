import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import TabPanelFilter from "components/admin/TabPanelFilter";
import DCMSLocationTable from "./components/DCMSLocationTable";
import SidebarDCMS from "components/admin/SidebarDCMS";

export default function AdLicense() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarDCMS />
        <TabPanelFilter props={<DCMSLocationTable />} />
      </Box>
    </div>
  );
}
