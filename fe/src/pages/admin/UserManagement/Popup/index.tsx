import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/system";
import classes from "./styles.module.scss";
import Heading4 from "components/common/text/Heading4";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
export default function Popup(props: any) {
  const { children, openPopup, setOpenPopup } = props;
  return (
    <Dialog open={openPopup}>
      <DialogTitle>
        <Box className={classes.boxTitle}>
          <Heading4>Thông tin cá nhân</Heading4>
          <IconButton onClick={() => setOpenPopup(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
