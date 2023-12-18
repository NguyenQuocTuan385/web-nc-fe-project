import React from "react";
import { Tab, Tabs, Box, Link } from "@mui/material";
import classes from "./style.module.scss";
import clsx from "clsx";
import Heading4 from "../../../../../components/common/text/Heading4";
import Heading5 from "../../../../../components/common/text/Heading5";
import Heading6 from "../../../../../components/common/text/Heading6";

function FormTopTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className={clsx(classes.borderBottom, classes.TabContainer)}>
      <Tabs
        className={classes.TabContainer}
        value={value}
        onChange={handleChange}
        centered
      >
        <Tab
          label={<span className={classes.tabItemTitle}>Thông tin chung</span>}
          onClick={() => window.location.replace("/#general")}
          wrapped
        />
        <Tab
          label={
            <Box display="flex" alignItems="center">
              <span className={classes.tabItemTitle}>Thông tin chi tiết</span>
            </Box>
          }
          onClick={() => window.location.replace("/#details")}
          wrapped
        />
        <Tab
          label={
            <Box display="flex" alignItems="center">
              <span className={classes.tabItemTitle}>Vị trí trên bản đồ </span>
            </Box>
          }
          onClick={() => window.location.replace("/#mapLocation")}
          wrapped
        />
        <Tab
          label={
            <Box display="flex" alignItems="center">
              <span className={classes.tabItemTitle}>Thông tin hợp đồng</span>
            </Box>
          }
          onClick={() => window.location.replace("/#contract")}
          wrapped
        />
        <Tab
          label={
            <Box display="flex" alignItems="center">
              <span className={classes.tabItemTitle}>Thông tin công ty</span>
            </Box>
          }
          onClick={() => window.location.replace("/#company")}
          wrapped
        />
        <Tab
          label={
            <Box display="flex" alignItems="center">
              <span className={classes.tabItemTitle}>Ảnh bảng quảng cáo</span>
            </Box>
          }
          onClick={() => window.location.replace("/#image")}
          wrapped
        />
      </Tabs>
    </Box>
  );
}

export default FormTopTab;
