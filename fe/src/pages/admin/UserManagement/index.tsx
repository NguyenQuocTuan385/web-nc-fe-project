import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import SideBarDCMS from "components/admin/SidebarDCMS";
import TabPanel from "./components/TabPanel";
import { Header } from "components/common/Header";

export default function UserManagement() {
  return (
    <Box className={classes.boxContainer}>
      <SideBarDCMS>
        <TabPanel />
      </SideBarDCMS>
    </Box>
  );
}
