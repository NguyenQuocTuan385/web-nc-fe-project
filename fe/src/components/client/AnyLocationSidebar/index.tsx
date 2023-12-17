import { Box, Drawer, IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import classes from "./styles.module.scss";

interface LocalAddressPopoverProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const AnyLocationSidebar = ({
  isOpen,
  closeSidebar,
}: LocalAddressPopoverProps) => {
  return (
    <Drawer variant="persistent" hideBackdrop={true} open={isOpen}>
      <Box
        className={classes.sidebarContainer}
        display={"flex"}
        flexDirection={"column"}
        width={"408px"}
      >
        <Box className={classes.iconBack}>
          <IconButton onClick={() => closeSidebar()}>
            <ChevronLeft fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AnyLocationSidebar;
