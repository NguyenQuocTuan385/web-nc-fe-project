import { Box, Drawer, IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import classes from "./styles.module.scss";
import AdvertiseInfo from "./AdvertiseInfo";
import { Location } from "models/location";
import { useEffect, useState } from "react";
import AdvertiseService from "services/advertise";
import { Advertise } from "models/advertise";
import ImagesGallery from "components/common/ImagesGallery";

interface LocalAddressPopoverProps {
  isOpen: boolean;
  closeSidebar: () => void;
  location: Location | null;
}

const LocationSidebar = ({ isOpen, closeSidebar, location }: LocalAddressPopoverProps) => {
  const [advertises, setAdvertises] = useState<Advertise[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const getAllAdvertises = async () => {
      if (!location) return;
      setImages(JSON.parse(location.images));
      AdvertiseService.getAdvertises(location.id, { pageSize: 999 })
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
        <Box className={classes.imgContainer}>{!!images && <ImagesGallery images={images}></ImagesGallery>}</Box>
        <Box className={classes.adsContainer}>
          {!!advertises && advertises.map((item) => <AdvertiseInfo key={item.id} advertise={item} />)}
        </Box>
      </Box>
    </Drawer>
  );
};

export default LocationSidebar;
