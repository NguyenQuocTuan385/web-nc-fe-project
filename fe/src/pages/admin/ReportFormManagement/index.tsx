import { Box } from "@mui/material";
import SidebarDCMS from "components/admin/SidebarDCMS";
import classes from "./styles.module.scss";
import ReportFormTable from "./components/ReportFormTable";
import TabPanelReportFormSearch from "./components/TabPanelReportFormSearch";

export default function ReportFormManagement() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarDCMS />
        <TabPanelReportFormSearch props={<ReportFormTable />} />
      </Box>
    </div>
  );
}
