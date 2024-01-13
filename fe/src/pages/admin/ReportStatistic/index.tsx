import Box from "@mui/system/Box";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import TabPanel from "./components/TabPanel";

export default function ReportStatistic() {
  return (
    <Box className={classes.boxContainer}>
      <SidebarDCMS>
        <TabPanel />
      </SidebarDCMS>
    </Box>
  );
}
