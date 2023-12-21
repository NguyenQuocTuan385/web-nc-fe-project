import { Box, Typography } from "@mui/material";
import Heading4 from "components/common/text/Heading4";
import classes from "./styles.module.scss";

export const InfoContract = ({ data }: any) => {
  return (
    <Box>
      <Heading4>Thông tin Công ty</Heading4>
      <Typography>
        <span className={classes.title}>Tên: </span>{" "}
        <span>{data.companyName}</span>
      </Typography>
      <Typography>
        <span className={classes.title}>Email: </span>
        <span>{data.companyEmail}</span>
      </Typography>
      <Typography>
        <span className={classes.title}>Điện thoại: </span>{" "}
        <span>{data.companyPhone}</span>
      </Typography>
      <Typography>
        <span className={classes.title}>Địa chỉ: </span>
        <span>{data.companyAddress}</span>
      </Typography>
    </Box>
  );
};


