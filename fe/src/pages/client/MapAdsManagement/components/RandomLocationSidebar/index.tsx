import { Box, Button, Drawer, IconButton } from "@mui/material";
import { ChevronLeft, Error } from "@mui/icons-material";
import classes from "./styles.module.scss";
import AdvertiseInfo from "./AdvertiseInfomation";
import ParagraphBody from "components/common/text/ParagraphBody";
import { RandomLocation } from "models/location";

interface LocalAddressPopoverProps {
  isOpen: boolean;
  closeSidebar: () => void;
  randomLocation: RandomLocation | null;
}

const RandomLocationSidebar = ({ isOpen, closeSidebar, randomLocation }: LocalAddressPopoverProps) => {
  return (
    <Drawer variant='persistent' hideBackdrop={true} open={isOpen}>
      <Box className={classes.sidebarContainer} display={"flex"} flexDirection={"column"} width={"408px"}>
        <Box className={classes.iconBack}>
          <IconButton onClick={() => closeSidebar()}>
            <ChevronLeft fontSize='large' />
          </IconButton>
        </Box>
        <AdvertiseInfo />
        <Box className={classes.boxContainer}>
          <ParagraphBody $fontWeight={"bold"} $colorName='--green-500'>
            Thông tin địa điểm
          </ParagraphBody>
          {/* <ParagraphBody $fontWeight={"bold"} $colorName="--green-500">
            Bệnh viện Quận Bình Thạnh
          </ParagraphBody> */}
          <ParagraphBody $colorName='--green-500'>{randomLocation?.address}</ParagraphBody>
          <Box className={classes.btnContainer}>
            <Button variant='outlined' color='error' startIcon={<Error />}>
              Báo cáo vi phạm
            </Button>
          </Box>
        </Box>{" "}
      </Box>
    </Drawer>
  );
};

export default RandomLocationSidebar;
