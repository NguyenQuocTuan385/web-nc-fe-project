import { Box, Button, Drawer, IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import classes from "./styles.module.scss";
import AdvertiseInfo from "./AdvertiseInfo";
import { Location } from "models/location";
import { useEffect, useState } from "react";
import AdvertiseService from "services/advertise";
import { Advertise } from "models/advertise";
import ImagesSlider from "components/common/ImagesSlider";
import Heading3 from "components/common/text/Heading3";
import images from "config/images";
import useIntercepts from "hooks/useIntercepts";
import ReportInfoPopup from "../ReportListPopup";
import ReportIcon from "@mui/icons-material/Report";

interface LocalAddressPopoverProps {
  isOpen: boolean;
  closeSidebar: () => void;
  location: Location | null;
}

const LocationSidebar = ({ isOpen, closeSidebar, location }: LocalAddressPopoverProps) => {
  const [advertises, setAdvertises] = useState<Advertise[]>([]);
  const [imagesLocation, setImagesLocation] = useState<string[]>([]);
  const intercept = useIntercepts();
  const [openReportInfoPopup, setOpenReportInfoPopup] = useState<boolean>(false);

  useEffect(() => {
    const getAllAdvertises = async () => {
      if (!location) return;
      setImagesLocation(JSON.parse(location.images));
      AdvertiseService.getAdvertisesByLocationId(location.id, { pageSize: 999 }, intercept)
        .then((res) => {
          setAdvertises(res.content);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllAdvertises();
  }, [location]);

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
        {!!imagesLocation && <ImagesSlider images={imagesLocation} />}
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
        {advertises.length > 0 ? (
          <Box className={classes.adsContainer}>
            {advertises.map((item) => (
              <AdvertiseInfo key={item.id} advertise={item} />
            ))}
          </Box>
        ) : (
          <Box className={classes.boxEmptyContainer}>
            <img src={images.emptyIcon} alt='empty icon' className={classes.imgEmpty} />
            <Heading3>Không có bảng quảng cáo nào</Heading3>
          </Box>
        )}
        {location && (
          <ReportInfoPopup
            open={openReportInfoPopup}
            setOpen={setOpenReportInfoPopup}
            locationId={location.id}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default LocationSidebar;
