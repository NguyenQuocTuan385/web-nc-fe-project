import { Box } from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import TabPanelFilter from "components/admin/TabPanelFilter";
import DistricTable from "./components/DistrictTable";

export default function DistrictManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarDCMS />
        <TabPanelFilter props={<DistricTable />} />
      </Box>
    </div>
  );
}
