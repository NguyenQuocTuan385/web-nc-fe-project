import { Box, Button, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import SideBarWard from "components/admin/SidebarWard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

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

export const WardDashBoard = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`${routes.admin.reports.ward}`);
  };

  return (
    <Box>
      {/* <Header /> */}
      <div className={classes["ward-dashboard-container"]}>
        <SideBarWard>
          <Box className={classes["container-body"]}>
            <ButtonBack onClick={() => goBack()}>
              <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
              Trở về
            </ButtonBack>
          </Box>
        </SideBarWard>
      </div>
    </Box>
  );
};
