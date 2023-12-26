import { Box } from "@mui/material";
import SideBarWard from "components/admin/SidebarWard";
import React from "react";
import TabPanel from "./TabPanel";

import classes from "./styles.module.scss";
import WardFilter from "components/admin/WardFilter";

function ContractList() {
  return (
    <Box className={classes.boxContainer}>
      <SideBarWard />
      <Box className={classes.rightComponentContainer}>
        <WardFilter
          districtId={1}
          propertyList={[
            {
              id: 3,
              name: "Phường Nguyễn Cư Trinh",
              code: "PHUONG",
              propertyParent: {
                id: 1,
                name: "Quận 5",
                code: "QUAN",
                propertyParent: undefined
              }
            },
            {
              id: 4,
              name: "Phường 4",
              code: "PHUONG",
              propertyParent: {
                id: 1,
                name: "Quận 5",
                code: "QUAN",
                propertyParent: undefined
              }
            },
            {
              id: 5,
              name: "Phường 3",
              code: "PHUONG",
              propertyParent: {
                id: 1,
                name: "Quận 5",
                code: "QUAN",
                propertyParent: undefined
              }
            }
          ]}
        />
        <TabPanel />
      </Box>
    </Box>
  );
}

export default ContractList;
