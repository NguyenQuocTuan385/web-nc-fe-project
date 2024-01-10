import { Box, Button, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import SideBarWard from "components/admin/SidebarWard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import images from "config/images";

const BoxFlex = styled(Box)(() => ({
  display: "flex",
  alignItems: "center"
}));

const ButtonBack = styled(Button)(() => ({
  paddingLeft: "0 !important",
  "&:hover": {
    backgroundColor: "transparent !important"
  }
}));

const IconButtonBack = styled(IconButton)(() => ({
  paddingLeft: "0 !important",
  "&:hover": {
    backgroundColor: "transparent !important"
  }
}));

export const DistrictDashBoard = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`${routes.admin.reports.ward}`);
  };

  return (
    <Box className={classes["ward-dashboard-container"]}>
      <SideBarWard>
        <Box component='img' src={images.NotFoundError} className={classes["container-body"]}></Box>
      </SideBarWard>
    </Box>
  );
};
