import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import SideBarWard from "components/admin/SidebarWard";
import MapAdsManagementAdmin from "../MapAdsManagement";

export const WardDashBoard = () => {
  return (
    <Box className={classes["ward-dashboard-container"]}>
      <SideBarWard>
        <Box className={classes["container-body"]}>
          <MapAdsManagementAdmin />
        </Box>
      </SideBarWard>
    </Box>
  );
};
