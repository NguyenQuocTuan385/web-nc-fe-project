import { Box, Button, Typography } from "@mui/material";
import images from "config/images";

const UnAuthorized = () => {
  return (
    <Box textAlign='center'>
      <Box component='img' src={images.unauthorized} />
      <Typography variant='h1'>Dừng lại</Typography>
      <Typography variant='h2'>Bạn không có quyền truy cập vào trang này</Typography>
      <Button variant='contained' sx={{ mt: 2, width: 200, height: 50 }}>
        Quay về
      </Button>
    </Box>
  );
};

export default UnAuthorized;
