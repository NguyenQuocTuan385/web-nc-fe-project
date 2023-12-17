import { Box, Button, Drawer, IconButton, TextField, Typography } from '@mui/material';
import { ChevronLeft, InfoOutlined, Error as ErrorIcon } from '@mui/icons-material';
import classes from "./styles.module.scss"

interface LocalAddressPopoverProps {
  isOpen: boolean
  closeSidebar: () => void
}

const Sidebar = ({ isOpen, closeSidebar }: LocalAddressPopoverProps) => {
  const local = {
    planning: true,
    address: "100 Lê Văn Sỹ, Phường 16, Q.5",
    ads_form_name: "Cổ động chính trị, Quảng cáo thương mại",
    location_type_name: "Đất công/Công viên/Hành lang an toàn giao thông"
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
          src="https://quangcaongoaitroi.com/wp-content/uploads/2020/02/Unique-OOH-bien-quang-cao-billboard-tren-duong-cao-toc-10.jpg"
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
            <Button variant='outlined' color='error' startIcon={<ErrorIcon />}>
              Báo cáo vi phạm
            </Button>           
          </Box>
        </Box>
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
          <Box display={"flex"} justifyContent={"space-between"} alignContent={"center"}>
            <InfoOutlined color='primary'/>
            <Button variant='outlined' color='error' startIcon={<ErrorIcon />}>
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