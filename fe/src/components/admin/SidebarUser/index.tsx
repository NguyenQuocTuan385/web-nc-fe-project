import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import SidebarManagement from "../SidebarManagement";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Header } from "components/common/Header";
import { User } from "models/user";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { ERole } from "models/general";

const drawerWidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  height: "100%",
  overflow: "auto",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end"
}));

export default function SideBarUser({ children }: any) {
  const currentUser: User = useSelector(selectCurrentUser);
  const sideBarItemListData = [
    {
      name: "Thông tin tài khoản",
      icon: <FontAwesomeIcon icon={faUser} size='lg' className={classes.itemIcon} />,
      link: routes.admin.users.edit
    },
    {
      name: "Đổi mật khẩu",
      icon: <FontAwesomeIcon icon={faLock} size='lg' className={classes.itemIcon} />,
      link: routes.admin.users.change_password
    },
    {
      name: "Quay lại",
      icon: <FontAwesomeIcon icon={faCircleLeft} size='lg' className={classes.itemIcon} />,
      link:
        currentUser?.role.id === ERole.WARD
          ? routes.admin.dashboard.wardDashboard
          : currentUser?.role.id === ERole.DISTRICT
            ? routes.admin.dashboard.district
            : routes.admin.dashboard.dcms
    }
  ];
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fff"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap component='div' color={"black"}>
              Cán Bộ{" "}
              {currentUser?.role.id === ERole.WARD
                ? "Phường"
                : currentUser?.role.id === ERole.WARD
                  ? "Quận"
                  : "Sở Văn Hóa"}
            </Typography>
          </Box>
          <Header></Header>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <SidebarManagement sideBarItem={sideBarItemListData} />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
