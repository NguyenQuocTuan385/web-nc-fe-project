import React from "react";
import { Tab, Tabs, Box } from "@mui/material";
import classes from "./style.module.scss";
import clsx from "clsx";
import { HashLink } from "react-router-hash-link";

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
          wrapped
          component={HashLink}
          to="#general"
        />

        <Tab
          label={
            <Box display="flex" alignItems="center">
              <span className={classes.tabItemTitle}>Thông tin chi tiết</span>
            </Box>
          }
          wrapped
          component={HashLink}
          to="#details"
        />
        <Tab
          label={
            <Box display="flex" alignItems="center">
              <span className={classes.tabItemTitle}>Vị trí trên bản đồ </span>
            </Box>
          }
          wrapped
          component={HashLink}
          to="#mapLocation"
        />
        <Tab
          label={
            <Box display="flex" alignItems="center">
              <span className={classes.tabItemTitle}>Thông tin hợp đồng</span>
            </Box>
          }
          wrapped
          component={HashLink}
          to="#contract"
        />
        <Tab
          label={
            <Box display="flex" alignItems="center">
              <span className={classes.tabItemTitle}>Thông tin công ty</span>
            </Box>
          }
          wrapped
          component={HashLink}
          to="#company"
        />
        <Tab
          label={
            <Box display="flex" alignItems="center">
              <span className={classes.tabItemTitle}>Ảnh bảng quảng cáo</span>
            </Box>
          }
          wrapped
          component={HashLink}
          to={"#image"}
        />
      </Tabs>
    </Box>
  );
}

export default FormTopTab;
