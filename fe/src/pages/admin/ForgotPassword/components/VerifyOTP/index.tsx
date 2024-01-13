import React, { useEffect } from "react";
import classes from "./styles.module.scss";
import { Box, Button, TextField } from "@mui/material";
import forgotpassword from "assets/img/forgotpassword/forgotpassword.jpg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import MailService from "services/email";
import Userservice from "services/user";
import { RequestOTP } from "models/email";
import { RequestOTPUser } from "models/user";
import useIntercepts from "hooks/useIntercepts";

interface FormData {
  email: string;
  otp: string;
}
export default function VerifyOTP() {
  const navigate = useNavigate();
  const [warn, setWarn] = React.useState<string | null>(null);
  const location = useLocation();
  // get params email
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const intercept = useIntercepts();

  useEffect(() => {
    if (!email) {
      navigate("/admin/login");
    }
  }, []);

  const schema = useMemo(() => {
    return yup.object().shape({
      otp: yup.string().required("Vui lòng nhập mã otp")
    });
  }, []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setWarn(null);
    }
  };

  const isValidOTP = (status: number, data: RequestOTPUser) => {
    if (status === 0) {
      setWarn("Mã OTP không hợp lệ");
    } else if (status === 1) {
      setWarn("Mã OTP đã hết hạn");
    } else {
      navigate(`/admin/recover/password?email=${data.email}&code=${data.otp}`);
    }
  };

  const onSubmit = (data: any) => {
    const FormSubmit: RequestOTPUser = {
      email: email!!,
      otp: data.otp
    };
    Userservice.checkOTP(FormSubmit, intercept)
      .then((res) => {
        isValidOTP(res, FormSubmit);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.boxContainer}>
        <img src={forgotpassword} alt='forgotpassword' />
        <Box className={classes.form}>
          <Box className={classes.formTitle}>Nhập mã OTP</Box>
          <Box className={classes.formContent}>
            <Box className={classes.formContentTitle}>
              Vui lòng kiểm tra mã trong email của bạn. Mã này gồm 6 số.{" "}
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box className={classes.formContentInput}>
                <TextField
                  fullWidth
                  variant='outlined'
                  placeholder='Nhập mã OTP'
                  {...register("otp")}
                  aria-invalid={errors.otp ? "true" : "false"}
                  error={Boolean(errors?.otp)}
                  onChange={handleInputChange}
                />
                <p className={classes.errorText}>{errors?.otp?.message}</p>
                <p className={classes.errorText}>{warn}</p>
              </Box>
              <Box className={classes.formContentButton}>
                <Button variant='outlined' color='primary' onClick={() => navigate(-1)}>
                  Hủy bỏ
                </Button>
                <Button type='submit' variant='contained' color='primary'>
                  Tiếp tục
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
