import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import TabPanelFilter from "components/admin/TabPanelFilter";
import AdTableLicense from "./components/AdTableLicense";
import SidebarDCMS from "components/admin/SidebarDCMS";

export default function AdLicense() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarDCMS />
        <TabPanelFilter props={<AdTableLicense />} />
      </Box>
    </div>
  );
}
