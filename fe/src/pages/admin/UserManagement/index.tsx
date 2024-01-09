import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import SideBarDCMS from "components/admin/SidebarDCMS";
import TabPanel from "./components/TabPanel";

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
