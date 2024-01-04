import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import ParagraphBody from "components/common/text/ParagraphBody";

const AdvertiseInfo = () => {
  return (
    <Box className={classes.boxContainer}>
      <ParagraphBody $fontWeight={"bold"} $colorName='--blue-600'>
        Thông tin bảng quảng cáo
      </ParagraphBody>
      <ParagraphBody $fontWeight={"bold"} $colorName='--blue-600'>
        Chưa có dữ liệu!
      </ParagraphBody>
      <ParagraphBody $colorName='--blue-600'>Vui lòng chọn điểm trên bản đồ để xem.</ParagraphBody>
    </Box>
  );
};

export default AdvertiseInfo;
