import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPeopleRoof,
    faCircleCheck,
    faChartSimple,
    faUserPlus,
    faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./styles.module.scss";
import UserManagement from "../../../pages/admin/UserManagement";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const drawerWidth = "20%";

interface SidebarItem {
    name: string;
    icon: JSX.Element;
    children?: Array<{ name: string }>;
}
interface SelectedItem {
    parentIndex: number | null;
    childIndex: number | null;
}

export default function SidebarManagement() {
    const [openItems, setOpenItems] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<SelectedItem>({
        parentIndex: null,
        childIndex: null,
    });

    const sidebar: SidebarItem[] = [
        {
            name: "Quản lý",
            icon: (
                <FontAwesomeIcon
                    icon={faPeopleRoof}
                    size="lg"
                    className={classes.itemIcon}
                />
            ),
            children: [
                { name: "Phường" },
                { name: "Quận" },
                { name: "Loại hình quảng cáo" },
                { name: "Loại hình thức báo cáo" },
                { name: "Các điểm đặt quảng cáo" },
                { name: "Bảng quảng cáo" },
            ],
        },
        {
            name: "Xét duyệt",
            icon: (
                <FontAwesomeIcon
                    icon={faCircleCheck}
                    size="lg"
                    className={classes.itemIcon}
                />
            ),
            children: [
                { name: "Cấp phép quảng cáo" },
                { name: "Chỉnh sửa địa điểm quảng cáo" },
                { name: "Chỉnh sửa bảng quảng cáo" },
            ],
        },
        {
            name: "Thống kê",
            icon: (
                <FontAwesomeIcon
                    icon={faChartSimple}
                    size="lg"
                    className={classes.itemIcon}
                />
            ),
        },
        {
            name: "Tạo tài khoản",
            icon: (
                <FontAwesomeIcon
                    icon={faUserPlus}
                    size="lg"
                    className={classes.itemIcon}
                />
            ),
        },
        {
            name: "Phân công tài khoản",
            icon: (
                <FontAwesomeIcon
                    icon={faUserPen}
                    size="lg"
                    className={classes.itemIcon}
                />
            ),
        },
    ];
    const [sideBar, setSidebar] = useState<SidebarItem[]>(sidebar);

    const handleClick = (index: number, child: Array<{ name: string }>) => {
        if (openItems === index) {
            setOpenItems(null);
            if (selectedItem.childIndex == null) {
                setSelectedItem({
                    parentIndex: index,
                    childIndex: null,
                });
            }
        } else {
            setOpenItems(index);
            setSidebar(sidebar);
            if (child.length === 0) {
                setSelectedItem({
                    parentIndex: index,
                    childIndex: null,
                });
                setSidebar((prevSideBar) =>
                    prevSideBar.map((item, i) =>
                        i === index
                            ? {
                                ...item,
                                icon: React.cloneElement(item.icon, {
                                    className: classes.selectedIcon,
                                }),
                            }
                            : item,
                    ),
                );
            } else {
                if (selectedItem.parentIndex === null) {
                    setSelectedItem({
                        parentIndex: index,
                        childIndex: null,
                    });
                }
            }
        }
    };

    const handleClickChild = (parentIndex: number, childIndex: number) => {
        setSelectedItem({
            parentIndex: parentIndex,
            childIndex: childIndex,
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
            >
                <Box sx={{ overflow: "auto" }}>
                    <List>
                        {sideBar.map((list, index) => (
                            <React.Fragment key={list.name}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => handleClick(index, list.children || [])}
                                        className={`${classes.item}`}
                                        sx={{
                                            backgroundColor:
                                                selectedItem.parentIndex === index && list.children === null
                                                    ? "#f0f0f0"
                                                    : "transparent",
                                        }}
                                    >
                                        <ListItemIcon>{list.icon}</ListItemIcon>
                                        <ListItemText
                                            primary={list.name}
                                            className={classes.itemText}
                                        />
                                        {list.children &&
                                            (openItems === index ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItemButton>
                                </ListItem>
                                {list.children && (
                                    <Collapse
                                        in={openItems === index}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <List component="div" disablePadding>
                                            {list.children.map((item, childIndex) => (
                                                <ListItemButton
                                                    key={item.name}
                                                    onClick={() => handleClickChild(index, childIndex)}
                                                    sx={{
                                                        backgroundColor:
                                                            selectedItem.parentIndex === index &&
                                                                selectedItem.childIndex === childIndex
                                                                ? "#f0f0f0"
                                                                : "transparent",
                                                        "&:hover": {
                                                            backgroundColor: "#e0e0e0", // Customize hover background color if needed
                                                        },
                                                        pl: 9,
                                                    }}
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
