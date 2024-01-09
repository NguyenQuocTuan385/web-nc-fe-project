import React from "react";

import { Box, Typography } from "@mui/material";
import images from "config/images";

const NotFound = () => {
  return (
    <Box textAlign='center'>
      <Box component='img' src={images.NotFoundError} />
      <Typography variant='h1'>Không tìm thấy trang</Typography>
      <Typography variant='h2'>Trang bạn đang tìm không tồn tại hoặc đã bị xóa</Typography>
    </Box>
  );
};

export default NotFound;
