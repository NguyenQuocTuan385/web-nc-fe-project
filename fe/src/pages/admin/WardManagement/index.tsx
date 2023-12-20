import { Box } from "@mui/material";
import SidebarManagement from "../../../components/admin/SidebarManagement";
import classes from "./styles.module.scss";
import TabPanelFilter from "components/admin/TabPanelFilter";
import WardTable from "./components/WardTable";

export default function WardManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarManagement />
        <TabPanelFilter props={<WardTable />} />
      </Box>
    </div>
  );
}
