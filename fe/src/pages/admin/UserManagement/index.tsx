import { Box } from "@mui/material";
import SidebarManagement from "../../../components/admin/SidebarManagement";
import TabPanel from "./TabPanel";
import classes from "./styles.module.scss";
import { sideBarItemListData } from "../AdLicense";

export default function UserManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarManagement sideBarItem={sideBarItemListData} />
        <TabPanel />
      </Box>
    </div>
  );
}
