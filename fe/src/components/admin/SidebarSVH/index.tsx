import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleRoof,
  faCircleCheck,
  faChartSimple,
  faUserPlus,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import SidebarManagement from "../SidebarManagement";
import classes from "./styles.module.scss";

const sideBarItemListData = [
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

function SideBarSVH() {
  return <SidebarManagement sideBarItem={sideBarItemListData} />;
}

export default SideBarSVH;
