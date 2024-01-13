import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import classes from "./styles.module.scss";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import Heading1 from "components/common/text/Heading1";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/user";
import { ERole } from "models/general";
import images from "config/images";
import { Avatar } from "@mui/material";
import { RootState } from "store";
import { selected } from "reduxes/Selected";
import { set } from "react-hook-form";

interface SidebarItem {
  name: string;
  icon: JSX.Element;
  link?: string;
  children?: Array<{ name: string; link: string }>;
}

interface SideBarItemList {
  sideBarItem: SidebarItem[];
}

interface state {
  parentIndex: number | null;
  childIndex: number | null;
}

export default function SidebarManagement(sideBarItemList: SideBarItemList) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locationHook = useLocation();
  const path = locationHook.pathname;
  const [sideBar, setSidebar] = useState<SidebarItem[]>(sideBarItemList.sideBarItem);
  const [openItems, setOpenItems] = useState<number | null>(null);

  useEffect(() => {
    sideBar.map((item, index) => {
      if (item.children) {
        item.children.map((child, childIndex) => {
          if (child.link.includes(path)) {
            dispatch(selected({ parentIndex: index, childIndex: childIndex }));
            setOpenItems(index);
            return;
          }
        });
      } else {
        if (item.link?.includes(path)) {
          dispatch(selected({ parentIndex: index, childIndex: -1 }));
          return;
        }
      }
    });
  }, [path]);
  const state = useSelector((state: RootState) => state.selected);
  const currentUser: User = useSelector(selectCurrentUser);

  const handleClick = (index: number, sideBarItem: SidebarItem, child: Array<{ name: string }>) => {
    if (sideBarItem.children === undefined) {
      dispatch(selected({ parentIndex: index, childIndex: -1 }));
      navigate(sideBarItem.link!!);
    }

    if (openItems === index) {
      setOpenItems(null);
    } else {
      setOpenItems(index);
      setSidebar(sideBarItemList.sideBarItem);
      if (child.length === 0) {
        setSidebar((prevSideBar) =>
          prevSideBar.map((item, i) =>
            i === index
              ? {
                  ...item,
                  icon: React.cloneElement(item.icon, {
                    className: classes.selectedIcon
                  })
                }
              : item
          )
        );

        if (sideBarItem && sideBarItem.link) {
          navigate(sideBarItem.link);
        }
      }
    }
  };

  const handleClickChild = (parentIndex: number, childIndex: number) => {
    dispatch(selected({ parentIndex: parentIndex, childIndex: childIndex }));
    navigate(sideBar[parentIndex].children!![childIndex].link);
  };

  return (
    <Box className={classes.boxContainer}>
      <Drawer variant='permanent' anchor='left' className={classes.sideBar}>
        <Box className={classes.TitleContainer} sx={{ padding: "0 16px" }}>
          <Avatar variant='rounded' src={images.agentIcon} />
          {currentUser?.role.id === ERole.DEPARTMENT ? (
            <Heading1 className={classes.agentText}>Sở văn hóa </Heading1>
          ) : (
            <Heading1 className={classes.agentText}>
              Cán bộ
              <Heading1 className={classes.agentText} sx={{ margin: "0 !important" }}>
                {currentUser?.property.name} {currentUser?.property.propertyParent?.name}
              </Heading1>
            </Heading1>
          )}
        </Box>
        <Box>
          <List>
            {sideBar.map((list, index) => (
              <React.Fragment key={index}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleClick(index, list, list.children || [])}
                    className={classes.item}
                    selected={state.parentIndex === index && state.childIndex === -1}
                  >
                    <ListItemIcon>{list.icon}</ListItemIcon>
                    <ListItemText primary={list.name} className={classes.itemText} />
                    {list.children && (openItems === index ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </ListItem>
                {list.children && (
                  <Collapse in={openItems === index} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                      {list.children.map((item, childIndex) => (
                        <ListItemButton
                          key={childIndex}
                          onClick={() => handleClickChild(index, childIndex)}
                          className={classes.childItem}
                          selected={state.parentIndex === index && state.childIndex === childIndex}
                        >
                          <ListItemText secondary={item.name} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
