import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import SidebarManagement from "../SidebarManagement";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";

const sideBarItemListData = [
  {
    name: "Thông tin tài khoản",
    icon: <FontAwesomeIcon icon={faUser} size='lg' className={classes.itemIcon} />,
    link: routes.admin.users.edit
  },
  {
    name: "Quên mật khẩu",
    icon: <FontAwesomeIcon icon={faLock} size='lg' className={classes.itemIcon} />
  }
];

function SideBarUser() {
  return <SidebarManagement sideBarItem={sideBarItemListData} />;
}

export default SideBarUser;
