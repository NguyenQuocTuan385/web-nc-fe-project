import { Avatar, Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import styled from "styled-components";
import { useState } from "react";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MenuWrapper>
      <BoxAvatar
        onClick={handleClick}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup='true'
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
        <Typography pl={"10px"}>Hữu Lộc</Typography>
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
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
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
