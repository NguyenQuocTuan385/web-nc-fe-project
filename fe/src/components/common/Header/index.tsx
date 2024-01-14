import { Avatar, Badge, Box, Button, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import styled from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut, loginStatus, selectCurrentUser } from "reduxes/Auth";
import { User } from "models/user";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { AuthenticationService } from "services/authentication";
import NotificationsIcon from "@mui/icons-material/Notifications";

const BoxAvatar = styled(Button)(() => ({
  display: "flex",
  alignItems: "center"
}));

const MenuWrapper = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  height: "100%",
  padding: "0 15px"
}));

const MenuAvatar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateProfileHandler = () => {
    navigate(routes.admin.users.edit);
  };

  const handleLogout = () => {
    setAnchorEl(null);

    AuthenticationService.logout().then(() => {
      dispatch(logOut());
      dispatch(loginStatus(false));
      navigate(routes.admin.authentication.login);
    });
  };

  const currentUser: User = useSelector(selectCurrentUser);

  const handleShowNotifications = () => {
    console.log("show notifications");
  };

  return (
    <MenuWrapper>
      <Tooltip title='Thông báo'>
        <Badge
          color='primary'
          sx={{ cursor: "pointer" }}
          badgeContent={0}
          onClick={handleShowNotifications}
          showZero
          style={{ margin: "10px 15px 0 0" }}
        >
          <NotificationsIcon style={{ color: "#686868", fontSize: "27px" }} />
        </Badge>
      </Tooltip>
      <BoxAvatar
        onClick={handleClick}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup='true'
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar alt={currentUser?.name} src={currentUser?.avatar} />
        <Typography pl={"10px"}>{currentUser?.name}</Typography>
      </BoxAvatar>

      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button"
        }}
      >
        <MenuItem onClick={updateProfileHandler}>Thôn tin tài khoản</MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </MenuWrapper>
  );
};

export const Header = () => {
  return (
    <MenuAvatar />
    // <Box className={classes["header-wrapper"]}>
    //   <MenuAvatar />
    // </Box>
  );
};
