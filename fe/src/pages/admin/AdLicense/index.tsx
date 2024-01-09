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
        <Box component='main' sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${300}px)` } }}>
          <TabPanelFilter props={<AdTableLicense />} />
        </Box>{" "}
      </Box>
    </div>
  );
}
