import { Box, Drawer, IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import classes from "./styles.module.scss";
import AdvertiseInfo from "./AdvertiseInfomation";
import ParagraphBody from "components/common/text/ParagraphBody";
import { RandomLocation } from "models/location";

interface LocalAddressPopoverProps {
  isOpen: boolean;
  closeSidebar: () => void;
  randomLocation: RandomLocation | null;
}

const RandomLocationSidebar = ({
  isOpen,
  closeSidebar,
  randomLocation
}: LocalAddressPopoverProps) => {
  return (
    <Drawer
      variant='persistent'
      hideBackdrop={true}
      open={isOpen}
      sx={{
        "& .MuiDrawer-root": {
          position: "absolute"
        },
        "& .MuiPaper-root": {
          position: "absolute"
        }
      }}
    >
      <Box className={classes.sidebarContainer}>
        <Box className={classes.iconBack}>
          <IconButton onClick={() => closeSidebar()}>
            <ChevronLeft fontSize='large' />
          </IconButton>
        </Box>
        <Box className={classes.boxContainer}>
          <AdvertiseInfo />
          <Box className={classes.boxWrapped}>
            <ParagraphBody fontWeight={"bold"} colorName='--green-500'>
              Thông tin địa điểm
            </ParagraphBody>
            <ParagraphBody colorName='--green-500'>{randomLocation?.address}</ParagraphBody>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default RandomLocationSidebar;
