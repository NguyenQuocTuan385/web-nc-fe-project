import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import MapAdsManagementAdmin from "../MapAdsManagement";
import SideBarDCMS from "components/admin/SidebarDCMS";

export const DCMSDashBoard = () => {
  return (
    <Box className={classes["ward-dashboard-container"]}>
      <SideBarDCMS>
        <Box className={classes["container-body"]}>
          <MapAdsManagementAdmin />
        </Box>
      </SideBarDCMS>
    </Box>
  );
};
