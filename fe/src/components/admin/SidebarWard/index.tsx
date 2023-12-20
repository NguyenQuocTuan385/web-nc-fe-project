import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleRoof,
  faCircleCheck,
  faChartSimple,
  faUserPlus,
  faUserPen,
  faRectangleAd,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import SidebarManagement from "../SidebarManagement";
import classes from "./styles.module.scss";

const sideBarItemListData = [
  {
    name: "Dashboard",
    icon: (
      <FontAwesomeIcon
        icon={faPeopleRoof}
        size="lg"
        className={classes.itemIcon}
      />
    ),
  },
  {
    name: "Quản lý điểm đặt và bảng quảng cáo",
    icon: (
      <FontAwesomeIcon
        icon={faRectangleAd}
        size="lg"
        className={classes.itemIcon}
      />
    ),
    children: [
      { name: "Quản lý bảng quảng cáo" },
      { name: "Quản lý điểm đặt quảng cáo" },
    ],
  },
  {
    name: "Quản lý báo cáo của người dân",
    icon: (
      <FontAwesomeIcon icon={faFlag} size="lg" className={classes.itemIcon} />
    ),
  },
  {
    name: "Cấp phép quảng cáo",
    icon: (
      <FontAwesomeIcon
        icon={faCircleCheck}
        size="lg"
        className={classes.itemIcon}
      />
    ),
  },
];

function SideBarWard() {
  return <SidebarManagement sideBarItem={sideBarItemListData} />;
}

export default SideBarWard;
