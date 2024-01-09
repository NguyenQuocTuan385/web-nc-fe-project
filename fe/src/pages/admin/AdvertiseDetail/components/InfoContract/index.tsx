import { Box, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import Heading4 from "components/common/text/Heading4";

export const InfoContract = ({ data }: any) => {
  return (
    <Box>
      <Heading4 fontWeight={600} fontSize={"18px"}>
        Thông tin công ty
      </Heading4>
      <Typography>
        <span className={classes.title}>Tên: </span> <span>{data.companyName}</span>
      </Typography>
      <Typography>
        <span className={classes.title}>Email: </span>
        <span>{data.companyEmail}</span>
      </Typography>
      <Typography>
        <span className={classes.title}>Điện thoại: </span> <span>{data.companyPhone}</span>
      </Typography>
      <Typography>
        <span className={classes.title}>Địa chỉ: </span>
        <span>{data.companyAddress}</span>
      </Typography>
    </Box>
  );
};
