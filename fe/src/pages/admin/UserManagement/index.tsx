import { Box } from "@mui/material";
import SidebarManagement from "../../../components/admin/SidebarManagement";
import TabPanel from "./components/TabPanel";
import classes from "./styles.module.scss";
import SideBarDCMS from "components/admin/SidebarDCMS";

export default function UserManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SideBarDCMS />
        <TabPanel />
      </Box>
    </div>
  );
}
