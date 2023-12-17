import { Error, InfoOutlined } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import React from "react";
import ParagraphBody from "../../../common/text/ParagraphBody";
import classes from "./styles.module.scss";
import { Advertise } from "../../../../models/advertise";

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
        <IconButton>
          <InfoOutlined color="primary" />
        </IconButton>
        <Button variant="outlined" color="error" startIcon={<Error />}>
          Báo cáo vi phạm
        </Button>
      </Box>
    </Box>
  );
};

export default AdvertiseInfo;
