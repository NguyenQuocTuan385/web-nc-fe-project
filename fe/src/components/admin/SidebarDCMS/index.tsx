import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleRoof,
  faCircleCheck,
  faChartSimple,
  faUserPlus,
  faUserPen
} from "@fortawesome/free-solid-svg-icons";
import SidebarManagement from "../SidebarManagement";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";

const sideBarItemListData = [
  {
    name: "Quản lý",
    icon: <FontAwesomeIcon icon={faPeopleRoof} size='lg' className={classes.itemIcon} />,
    children: [
      {
        name: "Quận/Phường",
        link: routes.admin.properties.district
      },
      {
        name: "Loại hình quảng cáo",
        link: routes.admin.advertiseType.root
      },
      {
        name: "Loại hình thức báo cáo",
        link: routes.admin.advertisesForm.root
      },
      {
        name: "Các điểm đặt quảng cáo",
        link: routes.admin.locations.dcms
      }
    ]
  },
  {
    name: "Xét duyệt",
    icon: <FontAwesomeIcon icon={faCircleCheck} size='lg' className={classes.itemIcon} />,
    children: [
      {
        name: "Cấp phép quảng cáo",
        link: routes.admin.reviewLisence.dcms
      },
      {
        name: "Chỉnh sửa địa điểm, bảng quảng cáo",
        link: routes.admin.reviewEdit.dcms
      }
    ]
  },
  {
    name: "Thống kê",
    icon: <FontAwesomeIcon icon={faChartSimple} size='lg' className={classes.itemIcon} />
  },
  {
    name: "Tạo tài khoản",
    icon: <FontAwesomeIcon icon={faUserPlus} size='lg' className={classes.itemIcon} />,
    link: routes.admin.users.dcmsCreate
  },
  {
    name: "Phân công tài khoản",
    icon: <FontAwesomeIcon icon={faUserPen} size='lg' className={classes.itemIcon} />,
    link: routes.admin.users.dcms
  }
];

function SideBarDCMS() {
  return <SidebarManagement sideBarItem={sideBarItemListData} />;
}

export default SideBarDCMS;
