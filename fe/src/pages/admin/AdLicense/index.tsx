import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import TabPanelFilter from "components/admin/TabPanelFilter";
import AdTableLicense from "./components/AdTableLicense";
import SideBarSVH from "components/admin/SidebarSVH";

export default function AdLicense() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SideBarSVH />
        <TabPanelFilter props={<AdTableLicense />} />
      </Box>
    </div>
  );
}
