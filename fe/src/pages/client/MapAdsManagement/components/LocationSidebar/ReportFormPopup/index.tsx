import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import "react-quill/dist/quill.snow.css";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Error } from "@mui/icons-material";
import Heading4 from "components/common/text/Heading4";
import InputTextfield from "components/common/inputs/InputTextField";
import TextTitle from "components/common/text/TextTitle";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import UploadImage from "components/common/UploadImage";
import InputWysiwyg from "components/common/InputWysiwyg";
import ReportFormService from "services/reportForm";
import { ReportForm } from "models/reportForm";
import InputSelect from "components/common/InputSelect";
import ReportService from "services/report";
import { EReportType, ReportCreateRequest } from "models/report";
import { RandomLocation } from "models/location";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";

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
  advertiseId?: number;
  reportTypeName: EReportType;
  randomLocation?: RandomLocation | null;
}
interface FormData {
  reportFormId: number;
  fullName: string;
  email: string;
  phone: string;
  content: string;
  images: string[] | File[];
}

export default function ReportFormPopup({
  setOpen,
  open,
  advertiseId,
  reportTypeName,
  randomLocation
}: ReportFormPopupProps) {
  const schema = useMemo(() => {
    return yup.object().shape({
      reportFormId: yup.number().required("Bắt buộc nhập hình thức báo cáo"),
      fullName: yup.string().required("Bắt buộc nhập họ và tên"),
      email: yup.string().required("Bắt buộc nhập email"),
      phone: yup.string().required("Bắt buộc nhập số điện thoại"),
      content: yup
        .string()
        .required("Bắt buộc nhập nội dung báo cáo")
        .notOneOf(["<p><br></p>", "<p></p>"], "Bắt buộc nhập nội dung báo cáo"),
      images: yup.array().max(2, "Tối đa 2 ảnh")
    });
  }, []);
  const [verified, setVerified] = useState(false);
  const [reportForms, setReportForms] = useState<ReportForm[]>([]);
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>();
  const [alertType, setAlertType] = useState<AlertType>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange"
  });
  const onClose = () => {
    setOpen(false);
    reset();
    setVerified(false);
  };

  const onSubmit = async (data: FormData) => {
    const files = data.images;
    const formSubmit: FormData = {
      ...data,
      images: []
    };

    if (files) {
      await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "test-react-uploads-unsigned");
          formData.append("api_key", process.env.REACT_APP_API_KEY_CLOUDINARY as string);

          const URL = process.env.REACT_APP_URL_CLOUDINARY as string;
          const uploadDataResult = await fetch(URL, {
            method: "POST",
            body: formData
          }).then((res) => res.json());

          formSubmit.images.push(uploadDataResult.secure_url);
        })
      );
    }

    let reportCreate: ReportCreateRequest = {
      reportFormId: formSubmit.reportFormId,
      fullName: formSubmit.fullName,
      email: formSubmit.email,
      phone: formSubmit.phone,
      content: formSubmit.content,
      images: JSON.stringify(formSubmit.images),
      reportTypeName: reportTypeName
    };

    if (reportTypeName === EReportType.ADVERTISE) {
      reportCreate = {
        ...reportCreate,
        advertiseId: advertiseId
      };
    } else {
      reportCreate = {
        ...reportCreate,
        address: randomLocation?.address,
        latitude: randomLocation?.latitude,
        longitude: randomLocation?.longitude
      };
    }

    ReportService.createReport(reportCreate)
      .then((res) => {
        setOpenSnackbarAlert(true);
        setAlertContent("Đăng báo cáo thành công");
        setAlertType(AlertType.Success);
      })
      .catch((err) => {
        setOpenSnackbarAlert(true);
        setAlertContent("Đăng báo cáo thất bại");
        setAlertType(AlertType.Error);
      });
  };

  function onChange() {
    setVerified(true);
  }

  useEffect(() => {
    ReportFormService.getAllReportForm({ pageSize: 999 })
      .then((res) => {
        setReportForms(res.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        <Box
          component='form'
          className={classes.formWrap}
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputSelect
            name='reportFormId'
            control={control}
            title='Hình thức báo cáo'
            errorMessage={errors.reportFormId?.message}
            elements={reportForms}
          />
          <InputTextfield
            title='Họ và tên'
            inputRef={register("fullName")}
            errorMessage={errors.fullName?.message}
            name='fullname'
            type='text'
          />
          <InputTextfield
            title='Email'
            inputRef={register("email")}
            errorMessage={errors.email?.message}
            name='email'
            type='email'
          />
          <InputTextfield
            title='Số điện thoại'
            inputRef={register("phone")}
            errorMessage={errors.phone?.message}
            name='phone'
            type='text'
          />
          <Grid container spacing={1} columns={12}>
            <Grid item xs={3}>
              <Box>
                <TextTitle>Ảnh báo cáo</TextTitle>
                <ParagraphSmall colorName='--red-error' fontWeight='bold'>
                  (*Tối đa 2 ảnh)
                </ParagraphSmall>
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Box className={classes.dropZone}>
                <Controller
                  name='images'
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
          <Controller
            name='content'
            control={control}
            render={({ field }) => (
              <InputWysiwyg
                value={field.value}
                onChange={(value) => field.onChange(value)}
                errorMessage={errors.content?.message}
                title='Nội dung báo cáo'
                onBlur={() => field.onBlur}
              />
            )}
          />
          <ReCAPTCHA
            sitekey='6LdE9TYpAAAAABIEFjjcUoseZr-hCu0ssMWUDn7Y'
            onChange={onChange}
            onExpired={() => setVerified(false)}
          />
          <Button disabled={!verified} type='submit' children='Nộp báo cáo' variant='contained' />
        </Box>
      </DialogContent>
      <SnackbarAlert
        open={openSnackbarAlert}
        setOpen={setOpenSnackbarAlert}
        type={alertType}
        content={alertContent}
      />
    </ReportDialog>
  );
}
