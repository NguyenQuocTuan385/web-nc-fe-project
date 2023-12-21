import { Error, InfoOutlined } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { useState } from "react";
import classes from "./styles.module.scss";
import ReportPopup from "../ReportPopup";
import AdvertiseInfoPopup from "../AdvertiseInfoPopup";
import ParagraphBody from "components/common/text/ParagraphBody";
import { Advertise } from "models/advertise";

interface AdvertiseInfoProps {
  advertise: Advertise;
}
const AdvertiseInfo = ({ advertise }: AdvertiseInfoProps) => {
  const [openReportPopup, setOpenReportPopup] = useState<boolean>(false);
  const [openAdvertiseInfoPopup, setOpenAdvertiseInfoPopup] = useState<boolean>(false);
  const closeAdvertiseInfoPopup = () => {
    setOpenAdvertiseInfoPopup(false);
  };
  const location = advertise.location;
  return (
    <Box className={classes.boxContainer}>
      <ParagraphBody $fontWeight={"bold"}>{advertise.adsType.name}</ParagraphBody>
      <ParagraphBody $colorName='--gray-50'>{location.address}</ParagraphBody>
      <Box className={classes.advertiseInfo}>
        <ParagraphBody>
          Kích thước:{" "}
          <b>
            {advertise.height}m x {advertise.width}m
          </b>
        </ParagraphBody>
        <ParagraphBody>
          Số lượng: <b>{advertise.pillarQuantity} trụ/bảng</b>
        </ParagraphBody>
        <ParagraphBody>
          Hình thức: <b>{location.adsForm.name}</b>
        </ParagraphBody>
        <ParagraphBody>
          Phân loại: <b>{location.locationType.name}</b>
        </ParagraphBody>
      </Box>
      <ParagraphBody>
        Trạng thái: <b>{advertise.lisencing ? "ĐÃ ĐƯỢC ĐẶT" : "CHƯA ĐẶT"}</b>
      </ParagraphBody>
      <Box className={classes.btnContainer}>
        <IconButton onClick={() => setOpenAdvertiseInfoPopup(true)}>
          <InfoOutlined fontSize='large' color='primary' />
        </IconButton>
        <Button variant='outlined' color='error' startIcon={<Error />} onClick={() => setOpenReportPopup(true)}>
          Báo cáo vi phạm
        </Button>
      </Box>
      <AdvertiseInfoPopup advertise={advertise} open={openAdvertiseInfoPopup} onClose={closeAdvertiseInfoPopup} />
      <ReportPopup open={openReportPopup} setOpen={setOpenReportPopup} />
    </Box>
  );
};

export default AdvertiseInfo;
