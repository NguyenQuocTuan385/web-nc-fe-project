import classes from "./styles.module.scss";
import { Box, Typography } from "@mui/material";
import { Location } from "models/location";
import SlideShowImages from "components/common/SlideShowImages";
import Heading3 from "components/common/text/Heading3";

interface InfoLocationProps {
  data: Location;
}

const InfoLocation: React.FC<InfoLocationProps> = ({ data }) => {
  return (
    <Box>
      <Box className={classes["info-container"]}>
        <Box className={classes["info-item"]}>
          <SlideShowImages images={JSON.parse(data.images)} />
        </Box>
        <Box sx={{ width: "50%" }}>
          <Heading3>Điểm đặt quảng cáo</Heading3>
          <Typography className={classes["inline-typo"]}>
            <span className={classes.title}>Địa chỉ: </span>
            <span>{data.address}</span>
          </Typography>
          <Typography className={classes["inline-typo"]}>
            <span className={classes.title}>Loại vị trí: </span>
            <span>{data.locationType.name}</span>
          </Typography>
          <Typography className={classes["inline-typo"]}>
            <span className={classes.title}>Loại hình thức: </span>
            <span>{data.adsForm.name}</span>
          </Typography>
          <Typography className={classes["inline-typo"]}>
            <span className={classes.title}>Tọa độ: </span>
            <span>
              [{data.latitude}, {data.longitude}]
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
      </Box>
    </Box>
  );
};

export default InfoLocation;
