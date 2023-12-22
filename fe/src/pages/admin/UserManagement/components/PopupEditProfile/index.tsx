import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import classes from "./styles.module.scss";
import Heading4 from "components/common/text/Heading4";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { Button, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import district from "../../../../../district.json";
import { DateTimePicker } from "@mui/x-date-pickers";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Box from "@mui/system/Box";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

interface PopupProps {
  openPopup: boolean;
  setOpenPopup: (value: boolean) => void;
}
interface District {
  id: number;
  name: string;
  wards: Ward[];
}
interface Ward {
  id: number;
  name: string;
}
interface Profile {
  name: string;
  role: string;
  avatar: string;
  email: string;
  phone: string;
  birthday: string;
  district: District;
  ward?: Ward;
}

const districts: District[] = district;

export default function Popup(props: PopupProps) {
  const [selectedRole, setSelectedRole] = useState("district");

  const schema = useMemo(() => {
    return yup.object().shape({
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
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Profile>({ resolver: yupResolver(schema) });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [fileImage, setFileImage] = useState<File | null>(null);

  const handleClickAvatar = async (event: any) => {
    const files = event.target.files;
    setFileImage(files[0]);
    setAvatarPreview(URL.createObjectURL(files[0]));
  };
  const profileSubmitHandler = async (data: any) => {
    const formSubmit: Profile = {
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
  const { openPopup, setOpenPopup } = props;
  const [selectedDistrict, setSelectedDistrict] = React.useState<District | null>(null);
  const [selectedWard, setSelectedWard] = React.useState<Ward | null>(null);
  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option: District) => option.name
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
          <form onSubmit={handleSubmit(profileSubmitHandler)}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Box className={classes.imageContainer}>
                    <img
                      src={
                        avatarPreview ||
                        "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/385780595_784340566826510_8513447287827069210_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=GAImUy0MBpQAX83N_Iw&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfBvnNhzjKmg3twnhZCz_D5mFrCYVy85E0G1u0aimZURQg&oe=6588C1D0"
                      }
                      alt='profile'
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
                          defaultValue={"Nguyễn Quốc Thịnh"}
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
                          defaultValue={"ngqt@gmail.com"}
                          {...register("email")}
                          aria-invalid={errors.email ? "true" : "false"}
                          error={Boolean(errors?.email)}
                        />
                        <p className={classes.errorText}>{errors?.email?.message}</p>
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
                        <Box className={classes.title}>Số điện thoại</Box>
                        <TextField
                          fullWidth
                          variant='outlined'
                          defaultValue={"09083276462"}
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
                        <Grid container spacing={5}>
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
