import { Error, InfoOutlined } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import classes from "./styles.module.scss";
import ReportPopup from "../ReportPopup";
import AdvertiseInfoPopup from "../AdvertiseInfoPopup";
import ParagraphBody from "../../../../../../components/common/text/ParagraphBody";
import { Advertise } from "../../../../../../models/advertise";

interface AdvertiseInfoProps {
  address: string;
  ads_form_name: string;
  location_type_name: string;
  advertise: Advertise;
}
const AdvertiseInfo = ({
  address,
  ads_form_name,
  location_type_name,
  advertise,
}: AdvertiseInfoProps) => {
  const [openReportPopup, setOpenReportPopup] = useState<boolean>(false);
  const [openAdvertiseInfoPopup, setOpenAdvertiseInfoPopup] =
    useState<boolean>(false);
  const closeReportPopup = () => {
    setOpenReportPopup(false);
  };
  const closeAdvertiseInfoPopup = () => {
    setOpenAdvertiseInfoPopup(false);
  };
  return (
    <Box className={classes.boxContainer}>
      <ParagraphBody $fontWeight={"bold"}>
        {advertise.ads_type_name}
      </ParagraphBody>
      <ParagraphBody $colorName="--gray-50">{address}</ParagraphBody>
      <Box className={classes.advertiseInfo}>
        <ParagraphBody>
          Kích thước:{" "}
          <b>
            {advertise.height}m x {advertise.width}m
          </b>
        </ParagraphBody>
        <ParagraphBody>
          Số lượng: <b>{advertise.pillar_quantity} trụ/bảng</b>
        </ParagraphBody>
        <ParagraphBody>
          Hình thức: <b>{ads_form_name}</b>
        </ParagraphBody>
        <ParagraphBody>
          Phân loại: <b>{location_type_name}</b>
        </ParagraphBody>
      </Box>
      <ParagraphBody>
        Trạng thái: <b>{advertise.lisencing ? "ĐÃ ĐƯỢC ĐẶT" : "CHƯA ĐẶT"}</b>
      </ParagraphBody>
      <Box className={classes.btnContainer}>
        <IconButton onClick={() => setOpenAdvertiseInfoPopup(true)}>
          <InfoOutlined fontSize="large" color="primary" />
        </IconButton>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Error />}
          onClick={() => setOpenReportPopup(true)}
        >
          Báo cáo vi phạm
        </Button>
      </Box>
      <AdvertiseInfoPopup
        advertise={advertise}
        open={openAdvertiseInfoPopup}
        onClose={closeAdvertiseInfoPopup}
      />
      <ReportPopup open={openReportPopup} onClose={closeReportPopup} />
    </Box>
  );
};

export default AdvertiseInfo;
