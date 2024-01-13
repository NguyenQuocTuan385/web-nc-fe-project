import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Alert, Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Header } from "components/common/Header";
import SideBarUser from "components/admin/SidebarUser";
import classes from "./styles.module.scss";
import { User } from "models/user";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import Heading2 from "components/common/text/Heading2";
import { ChangePasswordRequest } from "models/authentication";
import { AuthenticationService } from "services/authentication";
import { useDispatch } from "react-redux";
import { loading } from "reduxes/Loading";

const schema = yup.object().shape({
  oldPassword: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  newPassword: yup
    .string()
    .required("Vui lòng nhập mật khẩu mới")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .oneOf([yup.ref("newPassword"), null], "Mật khẩu không khớp")
});

interface FormData {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const onSubmit = async (data: FormData) => {
    const ChangePasswordRequest: ChangePasswordRequest = {
      email: currentUser?.email,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    };
    dispatch(loading(true));
    AuthenticationService.changePassword(ChangePasswordRequest)
      .then((res) => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        setShowAlertWrong(true);
        setTimeout(() => {
          setShowAlertWrong(false);
        }, 3000);
      })
      .finally(() => {
        dispatch(loading(false));
      });
  };

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertWrong, setShowAlertWrong] = useState(false);

  return (
    <Box className={classes.boxContainer}>
      {showAlert && (
        <Alert className={classes.alert} severity='success'>
          Cập nhật thành công
        </Alert>
      )}
      {showAlertWrong && (
        <Alert className={classes.alert} severity='error'>
          Sai mật khẩu
        </Alert>
      )}
      <SideBarUser>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className={classes.boxContent}>
            <Box className={classes.titleContent}>
              <Heading2>Đổi mật khẩu</Heading2>
            </Box>
            <Box className={classes.boxForm}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Box className={classes.title}>Mật khẩu hiện tại</Box>
                  <TextField
                    fullWidth
                    type='password'
                    variant='outlined'
                    placeholder='Nhập mật khẩu hiện tại'
                    {...register("oldPassword")}
                    aria-invalid={errors.oldPassword ? "true" : "false"}
                    error={Boolean(errors?.oldPassword)}
                  />
                  <p className={classes.errorText}>{errors?.oldPassword?.message}</p>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.title}>Mật khẩu mới</Box>
                  <TextField
                    fullWidth
                    type='password'
                    variant='outlined'
                    placeholder='Nhập mật khẩu mới'
                    {...register("newPassword")}
                    aria-invalid={errors.newPassword ? "true" : "false"}
                    error={Boolean(errors?.newPassword)}
                  />
                  <p className={classes.errorText}>{errors?.newPassword?.message}</p>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.title}>Xác nhận mật khẩu</Box>
                  <TextField
                    fullWidth
                    type='password'
                    variant='outlined'
                    placeholder='Xác nhận mật khẩu'
                    {...register("confirmPassword")}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    error={Boolean(errors?.confirmPassword)}
                  />
                  <p className={classes.errorText}>{errors?.confirmPassword?.message}</p>
                </Grid>
              </Grid>
            </Box>
            <Box className={classes.boxButton}>
              <Button variant='contained' type='submit'>
                Đổi mật khẩu
              </Button>
            </Box>
          </Box>
        </form>
      </SideBarUser>
    </Box>
  );
};

export default ChangePassword;
