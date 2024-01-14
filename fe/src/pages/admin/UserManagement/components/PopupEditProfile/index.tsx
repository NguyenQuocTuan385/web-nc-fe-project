import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import classes from "./styles.module.scss";
import Heading4 from "components/common/text/Heading4";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { Button, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { DateTimePicker } from "@mui/x-date-pickers";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Box from "@mui/system/Box";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { User, UserRequest } from "models/user";
import { Property } from "models/property";
import DistrictService from "services/district";
import WardService from "services/ward";
import dayjs, { Dayjs } from "dayjs";
import Userservice from "services/user";
import useIntercepts from "hooks/useIntercepts";
import { DateHelper } from "helpers/date";
import { useDispatch } from "react-redux";
import { loading } from "reduxes/Loading";

interface PopupProps {
  openPopup: boolean;
  setOpenPopup: (value: boolean) => void;
  user: User;
  onUpdated: () => void;
}
interface FormData {
  name: string;
  role: string;
  avatar: string;
  email: string;
  phone: string;
  birthday: Dayjs;
  district: Property;
  ward?: Property;
}
const getSchema = () =>
  yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên"),
    email: yup.string().required("Vui lòng nhập email"),
    role: yup.string().required("Vui lòng chọn phân hệ"),
    avatar: yup.string(),
    phone: yup.string().required("Vui lòng nhập số điện thoại"),
    birthday: yup.string().required("Vui lòng nhập ngày sinh"),
    district: yup.object().required("Vui lòng chọn quận"),
    ward: yup.object().when("role", {
      is: (role: string) => role === "ward",
      then: () => yup.object().required("Vui lòng chọn phường")
    })
  });

export default function Popup(props: PopupProps) {
  const { openPopup, setOpenPopup, user, onUpdated } = props;
  const dispatch = useDispatch();

  const schema = useMemo(getSchema, []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [districts, setDistricts] = useState<Property[]>([]);
  const [wards, setWards] = useState<Property[]>([]);
  const intercept = useIntercepts();

  const handleClickAvatar = async (event: any) => {
    const files = event.target.files;
    setFileImage(files[0]);
    setAvatarPreview(URL.createObjectURL(files[0]));
  };
  const updateUser = async (id: number, data: UserRequest) => {
    dispatch(loading(true));
    Userservice.updateUser(id, data, intercept)
      .then((res) => {
        setOpenPopup(false);
        resetForm();
        onUpdated();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(loading(false));
      });
  };

  const resetForm = () => {
    reset({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      birthday: dayjs(user.birthday),
      role: user.role.code === "DISTRICT" ? "district" : "ward",
      district:
        user.property.propertyParent === null ? user.property : user.property.propertyParent,
      ward: user.property
    });
  };
  const FormDataSubmitHandler = async (data: any) => {
    dispatch(loading(true));
    const formSubmit: UserRequest = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthday: DateHelper.convertStringToDate(data.birthday),
      avatar: user.avatar,
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
      formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY || "");

      const URL = "https://api.cloudinary.com/v1_1/dacvpgdfi/image/upload";
      const uploadDataResult = await fetch(URL, {
        method: "POST",
        body: formData
      })
        .then((res) => res.json())
        .finally(() => {
          dispatch(loading(false));
        });
      formSubmit.avatar = uploadDataResult.secure_url;
    }
    setAvatarPreview("");
    updateUser(user.id, formSubmit);
  };
  const [selectedRole, setSelectedRole] = useState(
    user.role.code === "DISTRICT" ? "district" : "ward"
  );
  const [selectedDistrict, setSelectedDistrict] = React.useState<Property | null>(null);
  const [selectedWard, setSelectedWard] = React.useState<Property | null>(null);
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
    resetForm();
  }, [user, reset]);

  useEffect(() => {
    setSelectedRole(user.role.code === "DISTRICT" ? "district" : "ward");
  }, [user.role.code]);

  useEffect(() => {
    if (user.property.code === "DISTRICT") {
      setSelectedDistrict(user.property);
      setSelectedWard(null);
    } else {
      setSelectedWard(user.property);
      setSelectedDistrict(user.property.propertyParent!!);
    }
  }, [user.property]);

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

  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option: Property) => option.name
  });
  return (
    <Dialog open={openPopup}>
      <DialogTitle>
        <Box className={classes.boxTitle}>
          <Heading4>Thông tin cá nhân</Heading4>
          <IconButton onClick={() => setOpenPopup(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText component='div'>
          <form onSubmit={handleSubmit(FormDataSubmitHandler)}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Box className={classes.imageContainer}>
                    <img
                      src={avatarPreview || user.avatar}
                      alt='FormData'
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
                  <Box className={classes.formContainer}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box className={classes.title}>Họ và tên</Box>
                        <TextField
                          fullWidth
                          variant='outlined'
                          defaultValue={user.name}
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
                          defaultValue={user.email}
                          {...register("email")}
                          aria-invalid={errors.email ? "true" : "false"}
                          error={Boolean(errors?.email)}
                        />
                        <p className={classes.errorText}>{errors?.email?.message}</p>
                      </Grid>
                      <Grid item xs={12}>
                        <Box className={classes.title}>Ngày sinh</Box>
                        <Controller
                          control={control}
                          defaultValue={dayjs(user.birthday)}
                          name='birthday'
                          aria-invalid={errors.birthday ? "true" : "false"}
                          rules={{ required: true }}
                          render={({
                            field: { ref, ...field },
                            fieldState: { invalid, error }
                          }) => (
                            <>
                              <DateTimePicker
                                inputRef={ref}
                                className={classes.datePickField}
                                {...field}
                                views={["year", "month", "day"]} // chỉ hiển thị chế độ xem ngày, tháng, và năm
                                format='DD/MM/YYYY' // định dạng ngày tháng năm
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
                        <Box className={classes.title}>Số điện thoại</Box>
                        <TextField
                          fullWidth
                          variant='outlined'
                          defaultValue={user.phone}
                          {...register("phone")}
                          aria-invalid={errors.phone ? "true" : "false"}
                          error={Boolean(errors?.phone)}
                        />
                        <p className={classes.errorText}>{errors?.phone?.message}</p>
                      </Grid>

                      <Grid item xs={12}>
                        <Box className={classes.title}>Phân hệ</Box>

                        <Controller
                          control={control}
                          name='role'
                          defaultValue={selectedRole}
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
                                <FormControlLabel
                                  value='district'
                                  control={<Radio />}
                                  label='Quận'
                                />
                                <FormControlLabel value='ward' control={<Radio />} label='Phường' />
                              </RadioGroup>
                              <div className={classes.errorText}>{error?.message}</div>
                            </>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={5}>
                          <Grid item xs={6}>
                            <Controller
                              control={control}
                              name='district'
                              aria-invalid={errors.district ? "true" : "false"}
                              rules={{ required: true }}
                              defaultValue={
                                user.property.propertyParent === null
                                  ? user.property
                                  : user.property.propertyParent
                              }
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
                                defaultValue={user.property}
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
                                        <TextField
                                          {...params}
                                          label='Phường'
                                          error={Boolean(error)}
                                        />
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
                      <Grid item xs={12}>
                        <Button variant='contained' type='submit' fullWidth>
                          Lưu
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </form>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
