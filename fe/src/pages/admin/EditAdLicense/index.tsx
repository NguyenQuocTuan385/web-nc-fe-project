import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import TabPanelAdvertise from "./components/TabPanelAdvertise";
import SideBarSVH from "components/admin/SidebarSVH";

export default function EditAdLicense() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SideBarSVH />
        <TabPanelAdvertise />
      </Box>
    </div>
  );
}
