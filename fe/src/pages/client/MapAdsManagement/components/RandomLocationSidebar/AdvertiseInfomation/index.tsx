import { Error } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/common/text/ParagraphBody";

interface AdvertiseInfoProps {}
const AdvertiseInfo = ({}: AdvertiseInfoProps) => {
  return (
    <Box className={classes.boxContainer}>
      <ParagraphBody $fontWeight={"bold"} $colorName="--blue-600">
        Thông tin bảng quảng cáo
      </ParagraphBody>
      <ParagraphBody $fontWeight={"bold"} $colorName="--blue-600">
        Chưa có dữ liệu!
      </ParagraphBody>
      <ParagraphBody $colorName="--blue-600">
        Vui lòng chọn điểm trên bản đồ để xem.
      </ParagraphBody>
      <Box className={classes.btnContainer}>
        <Button variant="outlined" color="error" startIcon={<Error />}>
          Báo cáo vi phạm
        </Button>
      </Box>
    </Box>
  );
};

export default AdvertiseInfo;
