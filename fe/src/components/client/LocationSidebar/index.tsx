import {
  Box,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChevronLeft,
  InfoOutlined,
  Error as ErrorIcon,
} from "@mui/icons-material";
import classes from "./styles.module.scss";
import AdvertiseInfo from "../AdvertiseInfo";

interface LocalAddressPopoverProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: LocalAddressPopoverProps) => {
  const location = {
    planning: true,
    address: "100 Lê Văn Sỹ, Phường 16, Q.5",
    ads_form_name: "Cổ động chính trị, Quảng cáo thương mại",
    location_type_name: "Đất công/Công viên/Hành lang an toàn giao thông",
    advertises: [
      {
        lisencing: true,
        height: 2.5,
        width: 10,
        ads_type_name: "Trụ bảng hiflex",
        pillar_quantity: 1,
      },
      {
        lisencing: false,
        height: 2,
        width: 10,
        ads_type_name: "Trụ màn hình điện tử LED",
        pillar_quantity: 2,
      },
    ],
  };

  return (
    <Drawer variant="persistent" hideBackdrop={true} open={isOpen}>
      <Box display={"flex"} flexDirection={"column"} width={"408px"}>
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
        </Box>
        {location.advertises.map((item) => (
          <AdvertiseInfo address={location.address} advertise={item} />
        ))}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
