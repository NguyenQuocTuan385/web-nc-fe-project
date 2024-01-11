import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Alert, Box, Button, Grid, TextField } from "@mui/material";
import { Header } from "components/common/Header";
import SideBarUser from "components/admin/SidebarUser";
import classes from "./styles.module.scss";
import avatar from "assets/img/avatar/default.jpg";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { DateTimePicker } from "@mui/x-date-pickers";
import Userservice from "services/user";
import { User, UserRequest } from "models/user";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import useIntercepts from "hooks/useIntercepts";
import { DateHelper } from "helpers/date";

const schema = yup.object().shape({
  fullName: yup.string().required("Họ tên là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  phone: yup.string().required("Số điện thoại là bắt buộc"),
  birthDay: yup.date().required("Ngày sinh là bắt buộc")
});

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  birthDay: string;
  image: string;
}

const EditProfile: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const intercept = useIntercepts();

  const onSubmit = async (data: FormData) => {
    const UserRequest: UserRequest = {
      name: data.fullName,
      email: data.email,
      birthday: DateHelper.convertStringToDate(data.birthDay),
      password: userInfo.password,
      avatar: avatarPreview,
      phone: data.phone,
      roleId: currentUser.role.id,
      propertyId: currentUser.property.id
    };
    Userservice.updateUser(currentUser.id, UserRequest, intercept)
      .then((res) => {
        console.log(res);
        setShowAlert(true);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const [showAlert, setShowAlert] = useState(false);
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [userInfo, setUserInfo] = useState<User>({} as User);

  const handleClickAvatar = async (event: any) => {
    const files = event.target.files;
    setFileImage(files[0]);
    setAvatarPreview(URL.createObjectURL(files[0]));
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await Userservice.getUserbyId(currentUser.id, intercept);
      setValue("fullName", res.name);
      setValue("email", res.email);
      setValue("phone", res.phone);
      // setValue("birthDay", res.birthday);
      setAvatarPreview(res.avatar);
      setUserInfo(res);
    };
    fetchData();
  }, []);

  const currentUser: User = useSelector(selectCurrentUser);

  return (
    <Box className={classes.boxContainer}>
      <SideBarUser>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className={classes.boxContent}>
            {showAlert && (
              <Alert className={classes.alert} severity='success'>
                Cập nhật thành công
              </Alert>
            )}
            <Box className={classes.boxForm}>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box className={classes.title}>Ảnh đại diện</Box>
                      <Box className={classes.imageContainer}>
                        <img src={avatarPreview || avatar} alt='avatar' className={classes.image} />
                        <label htmlFor='icon-button-file'>
                          <Box className={classes.iconButton}>
                            <input
                              accept='image/*'
                              className={classes.input}
                              id='icon-button-file'
                              type='file'
                              onChange={handleClickAvatar}
                              style={{ display: "none" }}
                            />
                            <CameraAltIcon />
                          </Box>
                        </label>
                      </Box>
                    </Grid>
                    <Grid item xs={12} className={classes.property}>
                      <label>Cán bộ: {userInfo.property?.name}</label>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box className={classes.title}>Họ và tên</Box>
                      <TextField
                        fullWidth
                        variant='outlined'
                        placeholder='Nhập họ và tên'
                        {...register("fullName")}
                        aria-invalid={errors.fullName ? "true" : "false"}
                        error={Boolean(errors?.fullName)}
                      />
                      <p className={classes.errorText}>{errors?.fullName?.message}</p>
                    </Grid>
                    <Grid item xs={12}>
                      <Box className={classes.title}>Email</Box>
                      <TextField
                        fullWidth
                        variant='outlined'
                        placeholder='Nhập email'
                        {...register("email")}
                        aria-invalid={errors.email ? "true" : "false"}
                        error={Boolean(errors?.email)}
                      />
                      <p className={classes.errorText}>{errors?.email?.message}</p>
                    </Grid>
                    <Grid item xs={12}>
                      <Box className={classes.title}>Số điện thoại</Box>
                      <TextField
                        fullWidth
                        variant='outlined'
                        placeholder='Nhập số điện thoại'
                        {...register("phone")}
                        aria-invalid={errors.phone ? "true" : "false"}
                        error={Boolean(errors?.phone)}
                      />
                      <p className={classes.errorText}>{errors?.phone?.message}</p>
                    </Grid>
                    <Grid item xs={12}>
                      <Box className={classes.title}>Ngày sinh</Box>
                      <Controller
                        defaultValue=''
                        control={control}
                        name='birthDay'
                        aria-invalid={errors.birthDay ? "true" : "false"}
                        rules={{ required: true }}
                        render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                          <>
                            <DateTimePicker
                              inputRef={ref}
                              className={classes.datePickField}
                              {...field}
                              views={["year", "month", "day"]} // chỉ hiển thị chế độ xem ngày, tháng, và năm
                              slotProps={{
                                textField: {
                                  required: true,
                                  error: invalid
                                }
                              }}
                            />
                            <div className={classes.errorText}>{error?.message}</div>
                          </>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box className={classes.boxButton}>
              <Button variant='contained' type='submit'>
                Cập nhật tài khoản
              </Button>
            </Box>
          </Box>
        </form>
      </SideBarUser>
    </Box>
  );
};

export default EditProfile;
