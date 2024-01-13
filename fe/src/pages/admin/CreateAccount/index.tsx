import React from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import SidebarDCMS from "components/admin/SidebarDCMS";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useForm, Controller } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useState, useMemo } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import { Button, TextField } from "@mui/material";
import { Property } from "models/property";
import WardService from "services/ward";
import DistrictService from "services/district";
import { useEffect } from "react";
import avatar from "assets/img/avatar/default.jpg";
import { UserRequest } from "models/user";
import Alert from "@mui/material/Alert";
import { AuthenticationService } from "services/authentication";
import { DateHelper } from "helpers/date";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useIntercepts from "hooks/useIntercepts";
import { useDispatch } from "react-redux";
import { loading } from "reduxes/Loading";
interface FormData {
  name: string;
  avatar: string;
  email: string;
  phone: string;
  birthday: string;
  password: string;
  confirmPassword: string;
  role: string;
  district: Property;
  ward?: Property;
}

export default function CreateAccount() {
  const [districts, setDistricts] = useState<Property[]>([]);
  const [wards, setWards] = useState<Property[]>([]);
  const [selectedDistrict, setSelectedDistrict] = React.useState<Property | null>(null);
  const [selectedWard, setSelectedWard] = React.useState<Property | null>(null);
  const navigate = useNavigate();
  const intercept = useIntercepts();
  const dispatch = useDispatch();
  const getAllWard = async (id: Number) => {
    WardService.getAllWardBy(
      Number(id),
      {
        search: "",
        pageSize: 999
      },
      intercept
    )
      .then((res) => {
        setWards(res.content);
        return res.content;
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    const getAllDistrict = async () => {
      DistrictService.getAllDistrict(
        {
          search: "",
          pageSize: 999
        },
        intercept
      )
        .then((res) => {
          setDistricts(res.content);
          return res.content;
        })
        .catch((err: any) => console.log(err));
    };
    getAllDistrict();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      getAllWard(selectedDistrict.id);
    }
  }, [selectedDistrict]);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [fileImage, setFileImage] = useState<File | null>(null);
  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option: Property) => option.name
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
    reset,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const resetForm = () => {
    reset({
      name: "",
      email: "",
      phone: "",
      birthday: "",
      password: "",
      confirmPassword: "",
      role: "district",
      district: undefined,
      ward: undefined
    });
    setSelectedDistrict(null);
    setSelectedWard(null);
    setAvatarPreview("");
  };
  const handleClickAvatar = async (event: any) => {
    const files = event.target.files;
    setFileImage(files[0]);
    setAvatarPreview(URL.createObjectURL(files[0]));
  };

  const createUser = async (data: UserRequest) => {
    dispatch(loading(true));
    AuthenticationService.register(data)
      .then((res) => {
        handleAddSuccess();
        resetForm();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(loading(false));
      });
  };
  const SubmitHandler = async (data: any) => {
    const formSubmit: UserRequest = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthday: DateHelper.convertStringToDate(data.birthday),
      avatar: "",
      password: data.password,
      roleId: selectedRole === "district" ? 3 : 2,
      propertyId: 0
    };
    if (selectedRole === "district") {
      formSubmit.propertyId = selectedDistrict?.id ?? 0;
    } else {
      formSubmit.propertyId = selectedWard?.id ?? 0;
    }
    const formData = new FormData();
    if (fileImage) {
      formData.append("file", fileImage);
      formData.append("upload_preset", "test-react-uploads-unsigned");
      formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY as string);

      const URL = "https://api.cloudinary.com/v1_1/dacvpgdfi/image/upload";
      const uploadDataResult = await fetch(URL, {
        method: "POST",
        body: formData
      }).then((res) => res.json());
      formSubmit.avatar = uploadDataResult.secure_url;
    }
    createUser(formSubmit);
  };
  const [showAlert, setShowAlert] = useState(false);

  const handleAddSuccess = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <Box className={classes.boxContainer}>
      <SidebarDCMS>
        <form onSubmit={handleSubmit(SubmitHandler)}>
          <Box className={classes.boxContent}>
            {showAlert && (
              <Alert className={classes.alert} severity='success'>
                Đã tạo thành công
              </Alert>
            )}
            <Box className={classes.backPage} onClick={() => navigate(-1)}>
              <ArrowBackIcon className={classes.iconBack} />
              Trở về
            </Box>
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
                        render={({
                          field: { ref, value, ...field },
                          fieldState: { invalid, error }
                        }) => (
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
                                  renderInput={(params) => (
                                    <TextField {...params} label='Quận' error={Boolean(error)} />
                                  )}
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
                                    options={wards}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(event, newValue) => {
                                      onChange(newValue); // cần gọi để cập nhật giá trị trong form
                                      setSelectedWard(newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField {...params} label='Phường' />
                                    )}
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
                              format='DD/MM/YYYY'
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
      </SidebarDCMS>
    </Box>
  );
  // Remove the closing </Box> tag
}
