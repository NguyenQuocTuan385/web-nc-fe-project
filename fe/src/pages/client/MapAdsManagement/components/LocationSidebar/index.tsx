import { Box, Button, Drawer, IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import classes from "./styles.module.scss";
import AdvertiseInfo from "./AdvertiseInfo";
import { Location } from "models/location";
import { useEffect, useState } from "react";
import { Advertise } from "models/advertise";
import ImagesSlider from "components/common/ImagesSlider";
import Heading3 from "components/common/text/Heading3";
import images from "config/images";
import AdvertiseClientService from "services/advertiseClient";
import ReportIcon from "@mui/icons-material/Report";
import ReportInfoPopup from "../ReportListPopup";

interface LocalAddressPopoverProps {
  isOpen: boolean;
  closeSidebar: () => void;
  location: Location | null;
}

const LocationSidebar = ({ isOpen, closeSidebar, location }: LocalAddressPopoverProps) => {
  const [advertises, setAdvertises] = useState<Advertise[]>([]);
  const [imagesLocation, setImagesLocation] = useState<string[]>([]);
  const [openReportInfoPopup, setOpenReportInfoPopup] = useState<boolean>(false);

  useEffect(() => {
    const getAllAdvertises = async () => {
      if (!location) return;
      setImagesLocation(JSON.parse(location.images));
      AdvertiseClientService.getAdvertisesByLocationId(location.id, { pageSize: 999 })
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
    <Drawer variant='persistent' hideBackdrop={true} open={isOpen}>
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
      </Box>
      {location && (
        <ReportInfoPopup
          open={openReportInfoPopup}
          setOpen={setOpenReportInfoPopup}
          locationId={location.id}
        />
      )}
    </Drawer>
  );
};

export default LocationSidebar;
