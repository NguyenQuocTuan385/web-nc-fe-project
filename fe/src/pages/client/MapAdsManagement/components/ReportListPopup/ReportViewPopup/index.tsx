import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Card, Grid, MenuItem, Select } from "@mui/material";
import classes from "./styles.module.scss";
import "react-quill/dist/quill.snow.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Error } from "@mui/icons-material";
import Heading4 from "components/common/text/Heading4";
import InputTextfield from "components/common/inputs/InputTextField";
import TextTitle from "components/common/text/TextTitle";
import { Report } from "models/report";
import ReactQuill from "react-quill";
import ParagraphBody from "components/common/text/ParagraphBody";
import images from "config/images";

export const ReportDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

interface ReportFormPopupProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  report: Report | null;
}

export default function ReportViewPopup({ setOpen, open, report }: ReportFormPopupProps) {
  const [filesPreview, setFilesPreview] = useState<string[]>([]);

  useEffect(() => {
    if (report?.images) {
      const images = JSON.parse(report?.images);
      setFilesPreview(images);
    }
  }, [report?.images]);

  const onClose = () => {
    setOpen(false);
    setFilesPreview([]);
  };

  return (
    <ReportDialog
      onClose={onClose}
      aria-labelledby='customized-dialog-title'
      open={open}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        <Box className={classes.titleWrap}>
          <Error color='error' className={classes.errorIc} />
          <Heading4 colorName='--red-error'>Báo cáo vi phạm</Heading4>
        </Box>
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
        <Box component='form' className={classes.formWrap} autoComplete='off'>
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <TextTitle>Hình thức báo cáo</TextTitle>
            </Grid>
            <Grid item xs={9}>
              <Select value={report?.reportForm.id} fullWidth readOnly={true}>
                <MenuItem value={report?.reportForm.id}>{report?.reportForm.name}</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <InputTextfield
            title='Họ và tên'
            value={report?.fullName}
            readOnly={true}
            name='fullname'
            type='text'
          />
          <InputTextfield
            title='Email'
            readOnly={true}
            value={report?.email}
            name='email'
            type='email'
          />
          <InputTextfield
            title='Số điện thoại'
            value={report?.phone}
            readOnly={true}
            name='phone'
            type='text'
          />
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <Box>
                <TextTitle>Ảnh báo cáo</TextTitle>
              </Box>
            </Grid>
            <Grid item xs={9}>
              {filesPreview.length > 0 ? (
                <Box>
                  <Box display={"flex"} gap={1}>
                    {filesPreview.map((item, index) => (
                      <Card
                        key={index}
                        className={classes.imagePreviewCardContainer}
                        variant='outlined'
                      >
                        <img src={item} alt='file upload' className={classes.imagePreview} />
                      </Card>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box className={classes.emptyImage}>
                  <img src={images.emptyIcon} alt='empty icon' />
                  <ParagraphBody>Không có ảnh nào được đăng</ParagraphBody>
                </Box>
              )}
            </Grid>
          </Grid>
          <Box className={classes.editor}>
            <TextTitle>Nội dung báo cáo</TextTitle>
            <ReactQuill readOnly={true} value={report?.content} />
          </Box>
          {report?.reply && (
            <Box className={classes.editor}>
              <TextTitle>Nội dung phản hồi</TextTitle>
              <ReactQuill readOnly={true} value={report?.reply} />
            </Box>
          )}
        </Box>
      </DialogContent>
    </ReportDialog>
  );
}
