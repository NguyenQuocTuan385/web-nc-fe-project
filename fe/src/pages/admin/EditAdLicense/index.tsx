import { Box } from "@mui/material";
import SidebarManagement from "../../../components/admin/SidebarManagement";
import classes from "./styles.module.scss";
import TabPanelAdvertise from "./components/TabPanelAdvertise";


export default function EditAdLicense() {
 
  return (
    <div>
      <Box className={classes.boxContainer} >
        <SidebarManagement />
        <TabPanelAdvertise />
      </Box>
    </div>
  );
}
