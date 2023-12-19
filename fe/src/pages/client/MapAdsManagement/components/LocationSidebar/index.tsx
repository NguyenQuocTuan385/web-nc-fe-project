import { Box, Drawer, IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import classes from "./styles.module.scss";
import AdvertiseInfo from "./AdvertiseInfo";
import { Location } from "models/location";

interface LocalAddressPopoverProps {
  isOpen: boolean;
  closeSidebar: () => void;
  location: Location | null;
}

const LocationSidebar = ({
  isOpen,
  closeSidebar,
  location,
}: LocalAddressPopoverProps) => {
  return (
    <Drawer variant="persistent" hideBackdrop={true} open={isOpen}>
      <Box className={classes.sidebarContainer}>
        <Box className={classes.iconBack}>
          <IconButton onClick={() => closeSidebar()}>
            <ChevronLeft fontSize="large" />
          </IconButton>
        </Box>
        <Box className={classes.imgContainer}>
          <img src={location?.images[0]} alt="anhqc" />
        </Box>
        <Box className={classes.adsContainer}>
          {location?.advertises.map((item, index) => (
            <AdvertiseInfo
              address={location?.address}
              key={index}
              advertise={item}
              ads_form_name={location?.adsForm.name}
              location_type_name={location?.locationType.name}
            />
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default LocationSidebar;
