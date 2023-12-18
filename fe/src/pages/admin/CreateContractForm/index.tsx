import React from "react";
import PropTypes from "prop-types";
import FormTopTab from "../../../components/admin/FormTopTab";
import { Box, Card, Paper } from "@mui/material";
import classes from "./styles.module.scss";
import AdDetails from "../../../components/admin/AdvertiseDetails";

function ContractForm() {
  return (
    <Box
      sx={{
        "& > :not(style)": {
          m: 2,
          width: 1073,
        },
      }}
      className={classes.pageContainer}
    >
      <h1>Tạo cấp phép mới</h1>
      <FormTopTab />
      <Card>
        <AdDetails />
      </Card>
    </Box>
  );
}

export default ContractForm;
