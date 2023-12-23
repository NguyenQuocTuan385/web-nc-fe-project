import { Box } from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import DistricTable from "./components/DistrictTable";
import TabPanelDistrictSearch from "./components/TabPanelDistrictSearch";

export default function DistrictManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarDCMS />
        <TabPanelDistrictSearch props={<DistricTable />} />
      </Box>
    </div>
  );
}
