import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import SidebarDCMS from "components/admin/SidebarDCMS";
import Information from "./components/Information";

export default function AdLicense() {
  return (
    <div>
      <Box className={classes.boxContainer}>
        <SidebarDCMS />
        <Information />
      </Box>
    </div>
  );
}
