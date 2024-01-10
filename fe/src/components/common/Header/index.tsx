import { Avatar, Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import styled from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut, loginStatus, selectCurrentUser } from "reduxes/Auth";
import { User } from "models/user";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { AuthenticationService } from "services/authentication";

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

  return (
    <MenuWrapper>
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
        <MenuItem onClick={updateProfileHandler}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </MenuWrapper>
  );
};

export const Header = () => {
  return (
    <Box className={classes["header-wrapper"]}>
      <MenuAvatar />
    </Box>
  );
};
