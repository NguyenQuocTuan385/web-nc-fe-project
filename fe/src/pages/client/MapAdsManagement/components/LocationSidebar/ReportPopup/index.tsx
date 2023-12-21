import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Card, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Error } from "@mui/icons-material";
import Heading4 from "components/common/text/Heading4";
import InputTextfield from "components/common/inputs/InputTextField";
import TextTitle from "components/common/text/TextTitle";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMessage from "components/common/text/ErrorMessage";
import clsx from "clsx";
import { useDropzone } from "react-dropzone";
import images from "config/images";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import UploadImage from "components/common/UploadImage";

const ReportDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface ReportPopupProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
interface FormData {
  reportFormName: string;
  fullname: string;
  email: string;
  phone: string;
  content: string;
  images: string[] | File[];
}

export default function ReportPopup({ setOpen, open }: ReportPopupProps) {
  const schema = useMemo(() => {
    return yup.object().shape({
      reportFormName: yup.string().required("Bắt buộc nhập hình thức báo cáo"),
      fullname: yup.string().required("Bắt buộc nhập họ và tên"),
      email: yup.string().required("Bắt buộc nhập email"),
      phone: yup.string().required("Bắt buộc nhập số điện thoại"),
      content: yup
        .string()
        .required("Bắt buộc nhập nội dung báo cáo")
        .notOneOf(["<p><br></p>"], "Bắt buộc nhập nội dung báo cáo"),
      images: yup.array().max(2, "Tối đa 2 ảnh"),
    });
  }, []);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onClose = () => {
    setOpen(false);
    reset();
    setVerified(false);
    // setFilesPreview([]);
    // setIsFileUploaded(false);
  };
  const [verified, setVerified] = useState(false);
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
  const onSubmit = async (data: FormData) => {
    const files = data.images;
    const formSubmit: FormData = {
      ...data,
      images: [],
    };
    console.log(files);
    await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "test-react-uploads-unsigned");
        formData.append("api_key", "487343349115581");

        const URL = "https://api.cloudinary.com/v1_1/dacvpgdfi/image/upload";
        const uploadDataResult = await fetch(URL, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());

        formSubmit.images.push(uploadDataResult.secure_url);
      })
    );

    // Now formData has all uploaded image URLs
    console.log(formSubmit);
  };
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

  function onChange(value: any) {
    setVerified(true);
  }

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
          <Error color="error" className={classes.errorIc} />
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
        <Box
          component="form"
          className={classes.formWrap}
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputTextfield
            title="Hình thức báo cáo"
            inputRef={register("reportFormName")}
            errorMessage={errors.reportFormName?.message}
            name="reportFormName"
            type="text"
          />
          <InputTextfield
            title="Họ và tên"
            inputRef={register("fullname")}
            errorMessage={errors.fullname?.message}
            name="fullname"
            type="text"
          />
          <InputTextfield
            title="Email"
            inputRef={register("email")}
            errorMessage={errors.email?.message}
            name="email"
            type="email"
          />
          <InputTextfield
            title="Số điện thoại"
            inputRef={register("phone")}
            errorMessage={errors.phone?.message}
            name="phone"
            type="text"
          />
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <Box>
                <TextTitle>Ảnh báo cáo</TextTitle>
                <ParagraphSmall $colorName="--red-error" $fontWeight="bold">
                  (*Tối đa 2 ảnh)
                </ParagraphSmall>
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Box className={classes.dropZone}>
                <Controller
                  name="images"
                  control={control}
                  render={({ field }) => (
                    <UploadImage
                      files={field.value}
                      errorMessage={errors.images?.message}
                      onChange={(value) => field.onChange(value)}
                      maxFiles={2}
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
          <Box className={classes.editor}>
            <TextTitle>Nội dung báo cáo</TextTitle>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  value={field.value || ""}
                  onBlur={() => field.onBlur}
                  onChange={(value) => field.onChange(value)}
                  modules={modules}
                  className={clsx({
                    [classes.editorError]: !!errors.content?.message,
                  })}
                />
              )}
            />
          </Box>
          {errors.content?.message && (
            <ErrorMessage>{errors.content?.message}</ErrorMessage>
          )}
          <ReCAPTCHA
            sitekey="6LdE9TYpAAAAABIEFjjcUoseZr-hCu0ssMWUDn7Y"
            onChange={onChange}
            onExpired={() => setVerified(false)}
          />
          <Button
            disabled={!verified}
            type="submit"
            children="Nộp báo cáo"
            variant="contained"
          />
        </Box>
      </DialogContent>
    </ReportDialog>
  );
}
