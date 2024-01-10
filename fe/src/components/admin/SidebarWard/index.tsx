import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleRoof,
  faCircleCheck,
  faRectangleAd,
  faFlag
} from "@fortawesome/free-solid-svg-icons";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";

import * as React from "react";
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
import SidebarManagement from "../SidebarManagement";
import { Header } from "components/common/Header";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/user";
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

export default function PersistentDrawerLeft({ children }: any) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const currentUser: User = useSelector(selectCurrentUser);
  const sideBarItemListData = [
    {
      name: "Dashboard",
      icon: <FontAwesomeIcon icon={faPeopleRoof} size='lg' className={classes.itemIcon} />,
      link:
        currentUser?.role.id === ERole.WARD
          ? routes.admin.dashboard.wardDashboard
          : routes.admin.dashboard.wardDashboard
    },
    {
      name: "QLý điểm đặt và bảng QC",
      icon: <FontAwesomeIcon icon={faRectangleAd} size='lg' className={classes.itemIcon} />,
      link:
        currentUser?.role.id === ERole.WARD
          ? routes.admin.locations.ward
          : routes.admin.locations.district
      // children: [{ name: "QLý bảng quảng cáo" }, { name: "QLý điểm đặt quảng cáo" }]
    },
    {
      name: "QLý báo cáo của người dân",
      icon: <FontAwesomeIcon icon={faFlag} size='lg' className={classes.itemIcon} />,
      link:
        currentUser?.role.id === ERole.WARD
          ? routes.admin.reports.ward
          : routes.admin.reports.district
    },
    {
      name: "Cấp phép quảng cáo",
      icon: <FontAwesomeIcon icon={faCircleCheck} size='lg' className={classes.itemIcon} />,
      link:
        currentUser?.role.id === ERole.WARD
          ? routes.admin.contracts.root
          : routes.admin.contracts.district
    }
  ];

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
              Cán Bộ {currentUser?.role.id === ERole.WARD ? "Phường" : "Quận"}
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
