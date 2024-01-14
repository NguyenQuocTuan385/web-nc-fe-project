import { Box, Button, Drawer, IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import classes from "./styles.module.scss";
import AdvertiseInfo from "./AdvertiseInfomation";
import ParagraphBody from "components/common/text/ParagraphBody";
import { RandomLocation } from "models/location";
import ReportIcon from "@mui/icons-material/Report";
import ReportInfoPopup from "../ReportListPopup";
import { useState } from "react";
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
  const [openReportInfoPopup, setOpenReportInfoPopup] = useState<boolean>(false);
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
          {randomLocation?.id && (
            <Button
              variant='contained'
              color='error'
              size='small'
              className={classes.errorBtn}
              startIcon={<ReportIcon />}
              onClick={() => setOpenReportInfoPopup(true)}
            >
              Xem báo cáo
            </Button>
          )}
          <AdvertiseInfo />
          <Box className={classes.boxWrapped}>
            <ParagraphBody fontWeight={"bold"} colorName='--green-500'>
              Thông tin địa điểm
            </ParagraphBody>
            <ParagraphBody colorName='--green-500'>{randomLocation?.address}</ParagraphBody>
          </Box>
        </Box>
      </Box>
      {randomLocation?.id && (
        <ReportInfoPopup
          open={openReportInfoPopup}
          setOpen={setOpenReportInfoPopup}
          reportId={randomLocation.id}
        />
      )}
    </Drawer>
  );
};

export default RandomLocationSidebar;
