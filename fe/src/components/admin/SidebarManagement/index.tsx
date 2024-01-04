import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

interface SidebarItem {
  name: string;
  icon: JSX.Element;
  link?: string;
  children?: Array<{ name: string }>;
}

interface SideBarItemList {
  sideBarItem: SidebarItem[];
}

interface SelectedItem {
  parentIndex: number | null;
  childIndex: number | null;
}

export default function SidebarManagement(sideBarItemList: SideBarItemList) {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    parentIndex: null,
    childIndex: null
  });
  const [sideBar, setSidebar] = useState<SidebarItem[]>(sideBarItemList.sideBarItem);

  const handleClick = (index: number, sideBarItem: SidebarItem, child: Array<{ name: string }>) => {
    if (openItems === index) {
      setOpenItems(null);
      if (selectedItem.childIndex == null) {
        setSelectedItem({
          parentIndex: index,
          childIndex: null
        });
      }
    } else {
      setOpenItems(index);
      setSidebar(sideBarItemList.sideBarItem);
      if (child.length === 0) {
        setSelectedItem({
          parentIndex: index,
          childIndex: null
        });
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
      } else {
        if (selectedItem.parentIndex === null) {
          setSelectedItem({
            parentIndex: index,
            childIndex: null
          });
        }
      }
    }
  };

  const handleClickChild = (parentIndex: number, childIndex: number) => {
    setSelectedItem({
      parentIndex: parentIndex,
      childIndex: childIndex
    });
  };

  return (
    <Box className={classes.boxContainer}>
      <Drawer variant='permanent' anchor='left' className={classes.sideBar}>
        <Box className={classes.sideBar}>
          <List>
            {sideBar.map((list, index) => (
              <React.Fragment key={index}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleClick(index, list, list.children || [])}
                    className={classes.item}
                    selected={selectedItem.parentIndex === index && list.children === undefined}
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
                          selected={selectedItem.parentIndex === index && selectedItem.childIndex === childIndex}
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
