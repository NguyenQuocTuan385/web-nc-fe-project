import { Box } from "@mui/material";
import SidebarManagement from "../../../components/admin/SidebarManagement";
import TabPanel from "./TabPanel";
import classes from "./styles.module.scss";
import SideBarSVH from "components/admin/SidebarSVH";
import SideBarWard from "components/admin/SidebarWard";

export default function UserManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SideBarWard />
        <TabPanel />
      </Box>
    </div>
  );
}
