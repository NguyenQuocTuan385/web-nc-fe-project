import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button } from "@mui/material";
import classes from "./styles.module.scss";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Error } from "@mui/icons-material";
import Heading4 from "../../../../../../components/common/text/Heading4";
import InputTextfield from "../../../../../../components/common/inputs/InputTextField";
import TextTitle from "../../../../../../components/common/text/TextTitle";

const ReportDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface ReportPopupProps {
  onClose: () => void;
  open: boolean;
}
export default function ReportPopup({ onClose, open }: ReportPopupProps) {
  const [value, setValue] = useState("");
  const myColors = [
    "green",
    "blue",
    "gray",
    "purple",
    "pink",
    "yellow",
    "white",
    "red",
    "black",
  ];
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: ["right", "center", "justify"] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      [{ color: myColors }],
      [{ background: myColors }],
    ],
  };

  return (
    <ReportDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Box className={classes.titleWrap}>
          <Error color="error" />
          <Heading4 $colorName="--red-error">Báo cáo vi phạm</Heading4>
        </Box>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box component="form" className={classes.formWrap}>
          <InputTextfield
            title="Hình thức báo cáo"
            defaultValue="Tố giác sai phạm"
            name="report_form_name"
            type="text"
          />
          <InputTextfield
            title="Họ và tên"
            defaultValue="Nguyễn Quốc Tuấn"
            name="fullname"
            type="text"
          />
          <InputTextfield
            title="Email"
            defaultValue="nqt20@gmail.com"
            name="email"
            type="email"
          />
          <InputTextfield
            title="Số điện thoại"
            defaultValue="0123456789"
            name="phone"
            type="text"
          />
          <Box className={classes.imagesmgAddWrap}>
            <TextTitle width={"170px"}>Ảnh báo cáo</TextTitle>
            <Button
              variant="outlined"
              startIcon={<AddPhotoAlternateOutlinedIcon />}
            >
              Thêm ảnh
            </Button>
          </Box>
          <Box className={classes.editor}>
            <TextTitle>Nội dung báo cáo</TextTitle>
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              modules={modules}
            />
          </Box>
        </Box>
      </DialogContent>
    </ReportDialog>
  );
}
