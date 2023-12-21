import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./styles.module.scss";
import { Box } from "@mui/material";
import { Advertise } from "models/advertise";
import Heading4 from "components/common/text/Heading4";
import ParagraphBody from "components/common/text/ParagraphBody";

const AdvertisePopup = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

interface AdvertisePopupProps {
  onClose: () => void;
  open: boolean;
  advertise: Advertise;
}
export default function AdvertiseInfoPopup({ onClose, open, advertise }: AdvertisePopupProps) {
  return (
    <AdvertisePopup onClose={onClose} aria-labelledby='customized-dialog-title' open={open} maxWidth='lg'>
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        <Heading4>Thông tin chi tiết bảng quảng cáo</Heading4>
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box className={classes.boxContainer}>
          <Box className={classes.boxWrapInfo}>
            <ParagraphBody $fontWeight={"bold"}>Ảnh bảng quảng cáo</ParagraphBody>
            <Box className={classes.imgContainer}>
              <img src={advertise.images} alt='ads-img' />
            </Box>
          </Box>
          {advertise.companyImgUrl && (
            <Box className={classes.boxWrapInfo}>
              <ParagraphBody $fontWeight={"bold"}>Ảnh bảng quảng cáo công ty</ParagraphBody>
              <ParagraphBody>
                Ngày hết hạn hợp đồng: <b>30/04/2024</b>
              </ParagraphBody>
              <Box className={classes.imgContainer}>
                <img src={advertise.companyImgUrl} alt='ads-img' />
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </AdvertisePopup>
  );
}
