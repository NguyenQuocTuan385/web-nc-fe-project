import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleRoof, faCircleCheck, faRectangleAd, faFlag } from "@fortawesome/free-solid-svg-icons";
import SidebarManagement from "../SidebarManagement";
import classes from "./styles.module.scss";

import { routes } from "routes/routes";

const sideBarItemListData = [
  {
    name: "Dashboard",
    icon: <FontAwesomeIcon icon={faPeopleRoof} size='lg' className={classes.itemIcon} />,
    link: routes.admin.locations.root
  },
  {
    name: "QLý điểm đặt và bảng QC",
    icon: <FontAwesomeIcon icon={faRectangleAd} size='lg' className={classes.itemIcon} />,
    link: routes.admin.locations.root
    // children: [{ name: "QLý bảng quảng cáo" }, { name: "QLý điểm đặt quảng cáo" }]
  },
  {
    name: "QLý báo cáo của người dân",
    icon: <FontAwesomeIcon icon={faFlag} size='lg' className={classes.itemIcon} />,
    link: routes.admin.reports.root
  },
  {
    name: "Cấp phép quảng cáo",
    icon: <FontAwesomeIcon icon={faCircleCheck} size='lg' className={classes.itemIcon} />
  }
];

function SideBarWard() {
  return <SidebarManagement sideBarItem={sideBarItemListData} />;
}

export default SideBarWard;
