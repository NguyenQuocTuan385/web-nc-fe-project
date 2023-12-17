import { Error, InfoOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import ParagraphBody from "../../common/text/ParagraphBody";

const AdvertiseInfo = ({ address }: any) => {
  return (
    <Box
      display={"flex"}
      padding={"20px"}
      flexDirection={"column"}
      gap={"15px"}
      borderBottom={"1px solid gray"}
    >
      <ParagraphBody>Trụ, Cụm pano</ParagraphBody>
      <ParagraphBody color={"gray"}>{address}</ParagraphBody>
      <Box display={"flex"} flexDirection={"column"} gap={"5px"}>
        <ParagraphBody $fontWeight={300}>Kích thước: 2.5m x 10m</ParagraphBody>
        <ParagraphBody>Số lượng: 1 trụ/bảng</ParagraphBody>
        <ParagraphBody>Hình thức: Cổ đông chính trị</ParagraphBody>
        <ParagraphBody>
          Phân loại: Đất công/Công viên/Hành lang an toàn giao thông
        </ParagraphBody>
      </Box>
      <ParagraphBody>Trạng thái: ĐÃ ĐƯỢC ĐẶT</ParagraphBody>
      <Box display={"flex"} justifyContent={"space-between"}>
        <InfoOutlined color="primary" />
        <Button variant="outlined" color="error" startIcon={<Error />}>
          Báo cáo vi phạm
        </Button>
      </Box>
    </Box>
  );
};

export default AdvertiseInfo;
