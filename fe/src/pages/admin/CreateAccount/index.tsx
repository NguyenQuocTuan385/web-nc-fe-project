import React from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import Heading3 from "components/common/text/Heading3";
import SidebarDCMS from "components/admin/SidebarDCMS";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useForm, Controller } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useState, useMemo } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import district from "../../../district.json";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import { Button, TextField } from "@mui/material";
interface District {
  id: number;
  name: string;
  wards: Ward[];
}
interface Ward {
  id: number;
  name: string;
}
interface User {
  name: string;
  avatar: string;
  email: string;
  phone: string;
  birthday: string;
  password: string;
  confirmPassword: string;
  role: string;
  district: District;
  ward: Ward;
}
const districts: District[] = district;

export default function CreateAccount() {
  const [selectedDistrict, setSelectedDistrict] = React.useState<District | null>(null);
  const [selectedWard, setSelectedWard] = React.useState<Ward | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [fileImage, setFileImage] = useState<File | null>(null);
  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option: District) => option.name
  });
  const [selectedRole, setSelectedRole] = useState("district");

  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Vui lòng nhập tên"),
      email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
      role: yup.string().required("Vui lòng chọn phân hệ"),
      avatar: yup.string(),
      phone: yup.string().required("Vui lòng nhập số điện thoại"),
      password: yup.string().required("Vui lòng nhập mật khẩu"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng nhập lại mật khẩu"),
      birthday: yup.string().required("Vui lòng nhập ngày sinh"),
      district: yup.object().required("Vui lòng chọn quận"),
      ward: yup.object().when("role", {
        is: (role: string) => role === "ward",
        then: () => yup.object().required("Vui lòng chọn phường")
      })
    });
  }, []);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<User>({ resolver: yupResolver(schema) });
  const handleClickAvatar = async (event: any) => {
    const files = event.target.files;
    setFileImage(files[0]);
    setAvatarPreview(URL.createObjectURL(files[0]));
  };
  const SubmitHandler = async (data: any) => {
    const formSubmit: User = {
      ...data,
      avatar: ""
    };
    const formData = new FormData();
    formData.append("file", fileImage as File);
    formData.append("upload_preset", "test-react-uploads-unsigned");
    formData.append("api_key", "487343349115581");
    const URL = "https://api.cloudinary.com/v1_1/dacvpgdfi/image/upload";
    const uploadDataResult = await fetch(URL, {
      method: "POST",
      body: formData
    }).then((res) => res.json());
    formSubmit.avatar = uploadDataResult.secure_url;
    console.log(formSubmit);
  };
  return (
    <Box className={classes.boxContainer}>
      <SidebarDCMS />
      <form onSubmit={handleSubmit(SubmitHandler)}>
        <Box className={classes.boxContent}>
          <Box className={classes.boxForm}>
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box className={classes.title}>Ảnh đại diện</Box>
                    <Box className={classes.imageContainer}>
                      <img
                        src={
                          avatarPreview ||
                          "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/385780595_784340566826510_8513447287827069210_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=GAImUy0MBpQAX83N_Iw&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfBvnNhzjKmg3twnhZCz_D5mFrCYVy85E0G1u0aimZURQg&oe=6588C1D0"
                        }
                        alt='avatar'
                        className={classes.image}
                      />
                      <label htmlFor='icon-button-file'>
                        <Box className={classes.iconButton}>
                          <input
                            accept='image/*'
                            className={classes.input}
                            id='icon-button-file'
                            type='file'
                            onChange={handleClickAvatar}
                            style={{ display: "none" }} // Hide the input
                          />
                          <CameraAltIcon />
                        </Box>
                      </label>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className={classes.title}>Phân hệ</Box>

                    <Controller
                      control={control}
                      name='role'
                      defaultValue='district'
                      aria-invalid={errors.role ? "true" : "false"}
                      rules={{ required: true }}
                      render={({ field: { ref, value, ...field }, fieldState: { invalid, error } }) => (
                        <>
                          <RadioGroup
                            value={value}
                            row
                            aria-labelledby='demo-row-radio-buttons-group-label'
                            name='row-radio-buttons-group'
                            onChange={(e) => {
                              field.onChange(e); // cần gọi để cập nhật giá trị trong form
                              setSelectedRole(e.target.value); // cập nhật giá trị trong state
                            }}
                          >
                            <FormControlLabel value='district' control={<Radio />} label='Quận' />
                            <FormControlLabel value='ward' control={<Radio />} label='Phường' />
                          </RadioGroup>
                          <div className={classes.errorText}>{error?.message}</div>
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box className={classes.title}>Chọn khu vực</Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Controller
                          control={control}
                          name='district'
                          aria-invalid={errors.district ? "true" : "false"}
                          rules={{ required: true }}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                              <Autocomplete
                                id='filter-demo'
                                options={districts}
                                getOptionLabel={(option) => option.name}
                                filterOptions={filterOptions}
                                onChange={(event, newValue) => {
                                  onChange(newValue); // cần gọi để cập nhật giá trị trong form
                                  setSelectedDistrict(newValue);
                                  setSelectedWard(null);
                                }}
                                value={selectedDistrict}
                                renderInput={(params) => <TextField {...params} label='Quận' error={Boolean(error)} />}
                              />
                              <div className={classes.errorText}>{error?.message}</div>
                            </>
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        {selectedRole === "ward" && (
                          <Controller
                            control={control}
                            name='ward'
                            aria-invalid={errors.ward ? "true" : "false"}
                            rules={{ required: selectedRole === "ward" }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                              <>
                                <Autocomplete
                                  id='filter-demo'
                                  options={
                                    districts.filter((district) => district.id === selectedDistrict?.id)[0]?.wards
                                  }
                                  getOptionLabel={(option) => option.name}
                                  onChange={(event, newValue) => {
                                    onChange(newValue); // cần gọi để cập nhật giá trị trong form
                                    setSelectedWard(newValue);
                                  }}
                                  renderInput={(params) => <TextField {...params} label='Phường' />}
                                  value={selectedWard}
                                  disabled={selectedDistrict === null}
                                />
                                <div className={classes.errorText}>{error?.message}</div>
                              </>
                            )}
                          />
                        )}
                      </Grid>
                    </Grid>
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
                      {...register("name")}
                      aria-invalid={errors.name ? "true" : "false"}
                      error={Boolean(errors?.name)}
                    />
                    <p className={classes.errorText}>{errors?.name?.message}</p>
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
                      name='birthday'
                      aria-invalid={errors.birthday ? "true" : "false"}
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
                  <Grid item xs={12}>
                    <Box className={classes.title}>Mật khẩu</Box>
                    <TextField
                      type='password'
                      fullWidth
                      variant='outlined'
                      placeholder='Nhập mật khẩu'
                      {...register("password")}
                      aria-invalid={errors.password ? "true" : "false"}
                      error={Boolean(errors?.password)}
                    />
                    <p className={classes.errorText}>{errors?.password?.message}</p>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className={classes.title}>Xác nhận mật khẩu</Box>
                    <TextField
                      type='password'
                      fullWidth
                      variant='outlined'
                      placeholder='Nhập lại mật khẩu'
                      {...register("confirmPassword")}
                      aria-invalid={errors.confirmPassword ? "true" : "false"}
                      error={Boolean(errors?.confirmPassword)}
                    />
                    <p className={classes.errorText}>{errors?.confirmPassword?.message}</p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Box className={classes.boxButton}>
            <Button variant='contained' type='submit'>
              Tạo tài khoản
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
  // Remove the closing </Box> tag
}
