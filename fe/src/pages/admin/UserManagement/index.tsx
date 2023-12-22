import { Box } from "@mui/material";
import TabPanel from "./TabPanel";
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
