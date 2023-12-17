import { Box, Button, Drawer, IconButton, TextField, Typography } from '@mui/material';
import { ChevronLeft, Error, InfoOutlined } from '@mui/icons-material';
import classes from "./styles.module.scss"

interface LocalAddressPopoverProps {
  isOpen: boolean
  closeSidebar: () => void
}

const Sidebar = ({ isOpen, closeSidebar}: LocalAddressPopoverProps) => {
  const local = {
    address: "100 Nguyễn Văn Cừ, Phường 16, Q.5",
  }

  return (
  <Drawer variant="persistent" hideBackdrop={true} open={isOpen}>
    <Box display={"flex"} flexDirection={"column"}>
      <Box display={"flex"} justifyContent={"right"}>
        <IconButton onClick={() => closeSidebar()}>
            <ChevronLeft fontSize="small" />
        </IconButton> 
      </Box>
      <Box className={classes.imgContainer}>
        <img
          src="https://cdn.brvn.vn/editor/2020/04/quangcaopanobillboardngoaitroi30_1585971255.jpg"
          alt="anhqc"
        />
        <TextField
          id="address"
          label="Address"
          defaultValue={local.address}
          autoComplete="current-addres"
          variant="standard"
        />
        <Box display={"flex"} padding={"20px"} flexDirection={"column"} gap={"15px"} borderBottom={"1px solid gray"}>
          <Typography>Trụ, Cụm pano</Typography>
          <Typography color={"gray"}>{local.address}</Typography>
          <Box display={"flex"} flexDirection={"column"} gap={"5px"}>
            <Typography fontWeight={"300"}>Kích thước: 2.5m x 10m</Typography>
            <Typography>Số lượng: 1 trụ/bảng</Typography>
            <Typography>Hình thức: Cổ đông chính trị</Typography>
            <Typography>Phân loại: Đất công/Công viên/Hành lang an toàn giao thông</Typography>
          </Box>
          <Typography>Trạng thái: ĐÃ ĐƯỢC ĐẶT</Typography>
          <Box display={"flex"} justifyContent={"space-between"}>
            <InfoOutlined color='primary'/>
            <Button variant='outlined' color='error' startIcon={<Error />}>
              Báo cáo vi phạm
            </Button>           
          </Box>
        </Box>
      </Box>
    </Box>
  </Drawer>
  )
}
  
export default Sidebar;