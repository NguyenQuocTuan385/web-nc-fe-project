import React from "react";
import classes from "./styles.module.scss";
import { Box, Button, TextField } from "@mui/material";
import forgotpassword from "assets/img/forgotpassword/forgotpassword.jpg";
import { useMemo } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import MailService from "services/email";
import { RequestOTP } from "models/email";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loading } from "reduxes/Loading";

interface FormData {
  email: string;
}
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [warn, setWarn] = React.useState<boolean>(false);
  const dispatch = useDispatch();

  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ")
    });
  }, []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = (data: any) => {
    const FormSubmit: RequestOTP = {
      email: data.email
    };
    dispatch(loading(true));
    MailService.sendOTPToEmail(FormSubmit)
      .then((res) => {
        navigate(`/admin/recover/code?email=${data.email}`);
      })
      .catch((err) => {
        setWarn(true);
      })
      .finally(() => {
        dispatch(loading(false));
      });
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.boxContainer}>
        <img src={forgotpassword} alt='forgotpassword' />
        <Box className={classes.form}>
          <Box className={classes.formTitle}>Quên mật khẩu</Box>
          <Box className={classes.formContent}>
            <Box className={classes.formContentTitle}>
              Nhập địa chỉ email chúng tôi sẽ gửi cho bạn mã OTP để đặt lại mật khẩu
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box className={classes.formContentInput}>
                <TextField
                  fullWidth
                  variant='outlined'
                  placeholder='Nhập email'
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  error={Boolean(errors?.email)}
                />
                <p className={classes.errorText}>{errors?.email?.message}</p>
                {warn && <p className={classes.errorText}>Email không tồn tại</p>}
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
