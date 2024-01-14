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
import Heading5 from "../text/Heading5";
import ParagraphBody from "../text/ParagraphBody";
import ParagraphSmall from "../text/ParagraphSmall";

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
  const [anchorProfile, setAnchorProfile] = useState<null | HTMLElement>(null);
  const openProfile = Boolean(anchorProfile);
  const [anchorNotifications, setAnchorNotifications] = useState<null | HTMLElement>(null);
  const openNotifications = Boolean(anchorNotifications);

  const handleOpenProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorProfile(event.currentTarget);
  };

  const handleOpenNotificationsMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorNotifications(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorProfile(null);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorNotifications(null);
  };

  const updateProfileHandler = () => {
    navigate(routes.admin.users.edit);
  };

  const handleLogout = () => {
    setAnchorProfile(null);

    AuthenticationService.logout().then(() => {
      dispatch(logOut());
      dispatch(loginStatus(false));
      navigate(routes.admin.authentication.login);
    });
  };

  const currentUser: User = useSelector(selectCurrentUser);

  const notificationsList = [
    {
      id: 1,
      createdAt: "2 phút",
      sender: "Sở văn hóa",
      avatarUrl: "https://i.pravatar.cc/1000",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmq1k95wJA5bP_jYuAeEomw-NanJEBmTULTA&usqp=CAU",
      typeNotification: "license-update-advertise",
      typeStatusNotification: "accepted"
    },
    {
      id: 2,
      createdAt: "1 tiếng",
      sender: "Sở văn hóa",
      avatarUrl: "https://i.pravatar.cc/1000",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmq1k95wJA5bP_jYuAeEomw-NanJEBmTULTA&usqp=CAU",
      typeNotification: "license-update-advertise",
      typeStatusNotification: "accepted"
    },
    {
      id: 3,
      createdAt: "1 phút",
      sender: "Sở văn hóa",
      avatarUrl: "https://i.pravatar.cc/1000",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmq1k95wJA5bP_jYuAeEomw-NanJEBmTULTA&usqp=CAU",
      typeNotification: "license-update-advertise",
      typeStatusNotification: "accepted"
    }
  ];

  return (
    <MenuWrapper>
      <Tooltip title='Thông báo'>
        <Badge
          color='primary'
          sx={{ cursor: "pointer" }}
          badgeContent={0}
          onClick={handleOpenNotificationsMenu}
          aria-controls={openNotifications ? "notifications-menu" : undefined}
          aria-haspopup='true'
          aria-expanded={openNotifications ? "true" : undefined}
          showZero
          style={{ margin: "10px 15px 0 0" }}
        >
          <NotificationsIcon style={{ color: "#686868", fontSize: "27px" }} />
        </Badge>
      </Tooltip>
      <BoxAvatar
        onClick={handleOpenProfileMenu}
        aria-controls={openProfile ? "basic-menu" : undefined}
        aria-haspopup='true'
        aria-expanded={openProfile ? "true" : undefined}
      >
        <Avatar alt={currentUser?.name} src={currentUser?.avatar} />
        <Typography pl={"10px"}>{currentUser?.name}</Typography>
      </BoxAvatar>

      <Menu
        id='basic-menu'
        anchorEl={anchorProfile}
        open={openProfile}
        onClose={handleCloseProfileMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button"
        }}
      >
        <MenuItem onClick={updateProfileHandler}>Thôn tin tài khoản</MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>

      <Menu
        id='notifications-menu'
        className={classes.notificationsMenu}
        anchorEl={anchorNotifications}
        open={openNotifications}
        onClose={handleCloseNotificationsMenu}
        component='div'
        sx={{ paddingBottom: "0" }}
      >
        <Box sx={{ borderBottom: "1px solid #ccc", padding: "0 8px 8px 8px", overflow: "hidden" }}>
          <Heading5>Thông báo</Heading5>
        </Box>
        {notificationsList &&
          notificationsList.length > 0 &&
          notificationsList.map((notification: any, index: number) => (
            <MenuItem sx={{ width: "100%" }}>
              <Avatar alt='Avatar' src={notification.avatarUrl} sx={{ width: 56, height: 56 }} />
              <Box sx={{ width: "300px", marginLeft: "10px" }}>
                <ParagraphBody
                  style={{
                    width: "100%",
                    wordWrap: "break-word",
                    whiteSpace: "normal"
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{notification.sender} đã gửi:</span> Bảng quảng
                  cáo của bạn đã cập nhật thành công
                </ParagraphBody>
                <ParagraphSmall style={{ color: "#888" }}>{notification.createdAt}</ParagraphSmall>
              </Box>

              <Box sx={{ width: "80px" }}>
                <img src={notification.imageUrl} className={classes.imageMenu} />
              </Box>
            </MenuItem>
          ))}
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
