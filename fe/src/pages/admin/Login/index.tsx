import React, { useMemo, useState } from "react";
import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import picture from "../../../assets/img/login/login.jpg";
import { routes } from "routes/routes";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthenticationService } from "services/authentication";
import { LoginRequest } from "models/authentication";
import { useDispatch, useSelector } from "react-redux";
import Userservice from "services/user";
import { Token } from "@mui/icons-material";
import { ERole, EStorageKey } from "models/general";
import { loginStatus, setLogin } from "reduxes/Auth";
import { API } from "config/constant";
import api from "services/configApi";
import { jwtDecode } from "jwt-decode";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = (data: any) => {
    const loginData: LoginRequest = {
      email: data.email,
      password: data.password
    };

    AuthenticationService.login(loginData)
      .then(async (res) => {
        const accessToken = res.access_token;

        const email = jwtDecode(accessToken).sub;

        const userResponse = await api.get(`${API.USER.EMAIL.replace(":email", `${email}`)}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userRole = userResponse.data.role.id;

        dispatch(setLogin({ user: userResponse.data, token: accessToken }));
        dispatch(loginStatus(true));

        if (userRole === ERole.DEPARTMENT) navigate(routes.admin.contracts.district);
        else if (userRole === ERole.DISTRICT) {
          console.log("Yes district");
          navigate(routes.admin.locations.district);
        } else navigate(routes.admin.contracts.root);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().required("Vui lòng điền email"),
      password: yup.string().required("Vui lòng điền mật khẩu")
    });
  }, []);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  return (
    <Box className={classes.loginContainer}>
      <Grid container spacing={2} className={classes.formBox}>
        <Grid item xs={6} className={classes.imageContainer}>
          <img src={picture} alt='login' className={classes.imageContainer} />
        </Grid>

        <Grid item xs={6} className={classes.formContainer}>
          <Typography variant='h5' gutterBottom>
            Đăng nhập
          </Typography>

          <form onSubmit={handleSubmit(handleLogin)}>
            <TextField
              label='Email'
              variant='outlined'
              margin='normal'
              required
              fullWidth
              {...register("email")}
              className={classes.customTextField}
              error={Boolean(errors?.email)}
            />
            <p className={classes.errorText}>{errors?.email?.message}</p>
            <TextField
              label='Password'
              type='password'
              variant='outlined'
              margin='normal'
              fullWidth
              required
              {...register("password")}
              className={classes.customTextField}
              error={Boolean(errors?.password)}
            />
            <p className={classes.errorText}>{errors?.password?.message}</p>

            <Button
              variant='contained'
              type='submit'
              size='large'
              fullWidth
              className={classes.loginButton}
            >
              Đăng nhập
            </Button>
          </form>

          <Link href='#' className={classes.forgotPasswordLink}>
            Quên mật khẩu
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Login;
