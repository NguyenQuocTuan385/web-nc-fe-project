import { Box, Typography } from "@mui/material";
import Heading4 from "components/common/text/Heading4";
import classes from "./styles.module.scss";

export const InfoAdvertise = ({ data }: any) => {
  return (
    <Box>
      <Heading4>Thông tin bảng quảng cáo</Heading4>
      <Typography className={classes.text}>
        <span className={classes.title}>Loại bảng quảng cáo: </span>
        <span>{data.adsType}</span>
      </Typography>
      <Typography className={classes.text}>
        <span className={classes.title}>Địa chỉ: </span>
        <span>{data.address}</span>
      </Typography>
      <Typography>
        <span className={classes.title}>Kích thước: </span> <span>{data.size}</span>
      </Typography>
      <Typography>
        <span className={classes.title}>Số lượng: </span>
        <span>{data.pillarQuantity}</span>
      </Typography>
      <Typography>
        <span className={classes.title}>Hình thức: </span> <span>{data.adsForm}</span>
      </Typography>
      <Typography>
        <span className={classes.title}>Phân loại: </span>
        <span>{data.locationType}</span>
      </Typography>
    </Box>
  );
};
