import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import TabPanelAdvertise from "./components/TabPanelAdvertise";
import SideBarDCMS from "components/admin/SidebarDCMS";

export default function EditAdLicense() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SideBarDCMS />
        <TabPanelAdvertise />
      </Box>
    </div>
  );
}
