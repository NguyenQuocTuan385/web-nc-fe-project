import { Box } from "@mui/material";
import SidebarManagement from "../../../components/admin/SidebarManagement";
import classes from "./styles.module.scss";
import TabPanelFilter from "components/admin/TabPanelFilter";
import DistricTable from "./components/DistrictTable";

export default function DistrictManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarManagement />
        <TabPanelFilter props={<DistricTable/>} />
      </Box>
    </div>
  );
}
