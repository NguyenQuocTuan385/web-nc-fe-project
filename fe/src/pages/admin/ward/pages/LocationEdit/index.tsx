import { Box, Button, IconButton } from "@mui/material";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { Header } from "../../components/common/Header";
import classes from "./styles.module.scss";
import Sidebar from "../../components/common/Sidebar";
import styled from "styled-components";

const YOUR_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 megabytes in bytes

interface FormData {
  khuVuc: string;
  diaChi: string;
  loaiViTri: string;
  hinhThucQuangCao: string;
  quyHoach: string;
  hinhAnh: FileList | null | []; // Thay đổi kiểu dữ liệu ở đây
}

const schema: any = Yup.object().shape({
  khuVuc: Yup.string().required("Khu vực là trường bắt buộc"),
  diaChi: Yup.string().required("Địa chỉ là trường bắt buộc"),
  loaiViTri: Yup.string().required("Loại vị trí là trường bắt buộc"),
  hinhThucQuangCao: Yup.string().required("Hình thức quảng cáo là trường bắt buộc"),
  quyHoach: Yup.string().required("Quy hoạch là trường bắt buộc"),
  hinhAnh: Yup.mixed().test("fileList", "Vui lòng chọn ít nhất một ảnh", (value: any) => {
    let filesArray: File[] = [];

    if (value instanceof FileList) {
      // Convert FileList to an array
      filesArray = Array.from(value);
    } else if (Array.isArray(value)) {
      // Use the array directly
      filesArray = value.filter((file) => file instanceof File);
    }

    if (!filesArray || filesArray.length === 0) {
      return false; // Fail validation if no files are selected
    }

    for (let i = 0; i < filesArray.length; i++) {
      if (filesArray[i].size > YOUR_MAX_FILE_SIZE) {
        return false; // Fail validation if any file size exceeds the max size
      }
    }

    return true; // All files are within size limit
  })
});

const ButtonSubmit = styled(Button)(
  () => `
  background-color: #389B42 !important;
  padding: 10px 15px !important;
  color: #fff !important;
  float: right;
`
);

const MyForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: FormData) => {
    // Xử lý logic khi submit form, có thể gửi dữ liệu lên server tại đây
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Khu vực */}
      <div className={classes["input-container"]}>
        <label>Khu vực:</label>
        <Controller
          control={control}
          name='khuVuc'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <input {...field} type='text' />
              {errors.khuVuc && <div className={classes["error-text"]}>{errors.khuVuc.message}</div>}
            </div>
          )}
        />
      </div>

      {/* Địa chỉ */}
      <div className={classes["input-container"]}>
        <label>Địa chỉ:</label>
        <Controller
          control={control}
          name='diaChi'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <input {...field} type='text' />
              {errors.diaChi && <div className={classes["error-text"]}>{errors.diaChi.message}</div>}
            </div>
          )}
        />
      </div>

      {/* Loại vị trí */}
      <div className={classes["input-container"]}>
        <label>Loại vị trí:</label>
        <Controller
          control={control}
          name='loaiViTri'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <select {...field}>
                <option value=''>Chọn loại vị trí</option>
                <option value='0'>Đất công</option>
                <option value='1'>Đất thổ cư</option>
              </select>
              {errors.loaiViTri && <div className={classes["error-text"]}>{errors.loaiViTri.message}</div>}
            </div>
          )}
        />
      </div>

      {/* Hình thức quảng cáo */}
      <div className={classes["input-container"]}>
        <label>Hình thức quảng cáo:</label>
        <Controller
          control={control}
          name='hinhThucQuangCao'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <select {...field}>
                <option value=''>Chọn hình thức quảng cáo</option>
                <option value='0'>Cổ động chính trị</option>
                <option value='1'>Quảng cáo thương mại</option>
              </select>
              {errors.hinhThucQuangCao && (
                <div className={classes["error-text"]}>{errors.hinhThucQuangCao.message}</div>
              )}
            </div>
          )}
        />
      </div>

      {/* Quy hoạch */}
      <div className={classes["input-container"]}>
        <label>Quy hoạch:</label>
        <Controller
          control={control}
          name='quyHoach'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <select {...field}>
                <option value=''>Chọn quy hoạch</option>
                <option value='0'>Chưa quy hoạch</option>
                <option value='1'>Đã quy hoạch</option>
              </select>
              {errors.quyHoach && <div className={classes["error-text"]}>{errors.quyHoach.message}</div>}
            </div>
          )}
        />
      </div>

      {/* Hình ảnh */}
      <div className={classes["input-container"]}>
        <label>Hình ảnh:</label>
        <Controller
          control={control}
          name='hinhAnh'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <input
                type='file'
                onChange={(e) => field.onChange(e.target.files)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                multiple={true}
              />
              {errors.hinhAnh && <div className={classes["error-text"]}>{errors.hinhAnh.message}</div>}
            </div>
          )}
        />
      </div>

      <ButtonSubmit type='submit'>Gửi</ButtonSubmit>
    </form>
  );
};

export const LocationEdit = () => {
  return (
    <Box>
      <Header />
      <div className={classes["location-edit-container"]}>
        <Sidebar></Sidebar>
        <Box className={classes["container-body"]}>
          <Button>
            <IconButton size='medium'>
              <FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>
            </IconButton>
            Trở về
          </Button>

          <Box className={classes["info-edit-container"]}>
            <h2>Thông tin điểm đặt quảng cáo</h2>
            <MyForm />
          </Box>
        </Box>
      </div>
    </Box>
  );
};
