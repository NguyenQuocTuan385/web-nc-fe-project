import React from "react";
import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import picture from "../../../assets/img/login/login.jpg";
import { routes } from "routes/routes";
import { useNavigate } from "react-router-dom";
const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(routes.admin.properties.district);
  };
  return (
    <Box className={classes.loginContainer}>
      <Grid container spacing={2} className={classes.formBox}>
        <Grid xs={6} className={classes.imageContainer}>
          <img src={picture} alt='login' className={classes.imageContainer} />
        </Grid>

        <Grid xs={6} className={classes.formContainer}>
          <Typography variant='h5' gutterBottom>
            Đăng nhập
          </Typography>
          <TextField
            label='Username'
            variant='outlined'
            margin='normal'
            required
            fullWidth
            className={classes.customTextField}
          />
          <TextField
            label='Password'
            type='password'
            variant='outlined'
            margin='normal'
            fullWidth
            required
            className={classes.customTextField}
          />

          <Button
            onClick={handleLogin}
            variant='contained'
            size='large'
            fullWidth
            className={classes.loginButton}
          >
            Đăng nhập
          </Button>

          <Link href='/admin/recover' className={classes.forgotPasswordLink}>
            Quên mật khẩu
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Login;
