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
import { RequestOTPUser } from "models/user";
import Userservice from "services/user";

interface FormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}
export default function ResetPassword() {
  const navigate = useNavigate();
  const [warn, setWarn] = React.useState<string | null>(null);
  const location = useLocation();
  // get params email
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const otp = searchParams.get("code");

  useEffect(() => {
    if (!email || !otp) {
      navigate("/admin/login");
    } else {
      Userservice.checkOTP({ email: email, otp: otp }).then((res) => {
        if (res != 2) {
          navigate("/admin/login");
        }
      });
    }
  }, []);

  const schema = useMemo(() => {
    return yup.object().shape({
      password: yup
        .string()
        .required("Vui lòng nhập mật khẩu mới")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
      confirmPassword: yup
        .string()
        .required("Vui lòng xác nhận mật khẩu")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .oneOf([yup.ref("password"), null], "Mật khẩu không khớp")
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

  const isValidOTP = (status: number) => {
    if (status === 0) {
      setWarn("Mã OTP không hợp lệ");
    } else if (status === 1) {
      setWarn("Mã OTP đã hết hạn");
    } else {
      navigate("/admin/reccover/password");
    }
  };

  const onSubmit = (data: any) => {
    const FormSubmit: RequestOTPUser = {
      email: email!!,
      otp: data.otp
    };
    Userservice.checkOTP(FormSubmit)
      .then((res) => {
        isValidOTP(res);
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
          <Box className={classes.formTitle}>Đặt lại mật khẩu</Box>
          <Box className={classes.formContent}>
            <Box className={classes.formContentTitle}>Tạo mật khẩu mới có tối thiểu 6 ký tự.</Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box className={classes.formContentInput}>
                <TextField
                  fullWidth
                  variant='outlined'
                  placeholder='Mật khẩu mới'
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                  error={Boolean(errors?.password)}
                  onChange={handleInputChange}
                />
                <p className={classes.errorText}>{errors?.password?.message}</p>

                <TextField
                  fullWidth
                  variant='outlined'
                  placeholder='Xác nhận mật khẩu'
                  {...register("confirmPassword")}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  error={Boolean(errors?.confirmPassword)}
                  onChange={handleInputChange}
                />
                <p className={classes.errorText}>{errors?.confirmPassword?.message}</p>
              </Box>
              <Box className={classes.formContentButton}>
                <Button variant='outlined' color='primary' onClick={() => navigate("/admin/login")}>
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
