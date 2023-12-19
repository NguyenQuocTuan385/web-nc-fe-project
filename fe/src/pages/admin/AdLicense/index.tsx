import { Box } from "@mui/material";
import SidebarManagement from "../../../components/admin/SidebarManagement";
import classes from "./styles.module.scss";
import TabPanelFilter from "components/admin/TabPanelFilter";
import AdTableLicense from "./components/AdTableLicense";


export default function AdLicense() {
 
  return (
    <div>
      <Box className = {classes.boxContainer} >
        <SidebarManagement />
        <TabPanelFilter props={<AdTableLicense/>} />

      </Box>
    </div>
  );
}
