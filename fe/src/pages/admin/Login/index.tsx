import React, { useMemo } from "react";
import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import picture from "../../../assets/img/login/login.jpg";
import { routes } from "routes/routes";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = (data: any) => {
    console.log(data);
    // navigate(routes.admin.properties.district);
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
            />
            <TextField
              label='Password'
              type='password'
              variant='outlined'
              margin='normal'
              fullWidth
              required
              {...register("password")}
              className={classes.customTextField}
            />

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
