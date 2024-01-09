import classes from "./styles.module.scss";
import { Box, Typography } from "@mui/material";
import { LocationView } from "models/location";
import SlideShowImages from "components/common/SlideShowImages";
import Heading3 from "components/common/text/Heading3";

interface InfoLocationProps {
  data: LocationView;
}

const InfoLocation: React.FC<InfoLocationProps> = ({ data }) => {
  return (
    <Box className={classes["info-container"]}>
      <Box className={classes["info-item"]}>
        <SlideShowImages images={data.images} />
        {/* <img src={data.images} alt='Điểm đặt quảng cáo' /> */}

        <Heading3>Điểm đặt quảng cáo</Heading3>
        <Typography className={classes["inline-typo"]}>
          <span className={classes.title}>Địa chỉ: </span>
          <span>{data.address}</span>
        </Typography>
        <Typography className={classes["inline-typo"]}>
          <span className={classes.title}>Loại vị trí: </span>
          <span>{data.locationType}</span>
        </Typography>
        <Typography className={classes["inline-typo"]}>
          <span className={classes.title}>Loại hình: </span>
          <span>{data.adsForm}</span>
        </Typography>
        <Typography className={classes["inline-typo"]}>
          <span className={classes.title}>Tọa độ: </span>
          <span>
            [{data.latitude}, {data.longtitude}]
          </span>
        </Typography>
        <Typography
          variant='h6'
          style={{ textTransform: "uppercase" }}
          className={`${classes["planning-text"]} ${
            data.planning ? classes["active"] : classes["inactive"]
          }`}
        >
          {data.planning ? "đã quy hoạch" : "chưa quy hoạch"}
        </Typography>
      </Box>

      <Box className={classes["map-item"]}>
        <img
          src='https://baotayninh.vn/image/fckeditor/upload/2020/20200308/images/hoang%20mang%201.png'
          alt='Map'
        />
      </Box>
    </Box>
  );
};

export default InfoLocation;
