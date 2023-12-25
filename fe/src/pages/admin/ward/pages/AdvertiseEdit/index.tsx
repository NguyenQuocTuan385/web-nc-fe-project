import { Box, Button, IconButton, Typography } from "@mui/material";
import advertiseDetail from "../AdvertiseDetail/advertise-detail.json";
import { InfoContract } from "../AdvertiseDetail/components/InfoContract";
import { Header } from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

const YOUR_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 megabytes in bytes

interface FormData {
  adsForm: number;
  adsType: number;
  licensing: number;
  width: number;
  height: number;
  content: string;
  images: FileList | null; // Thay đổi kiểu dữ liệu ở đây
}

const schema: any = Yup.object().shape({
  adsForm: Yup.number().required("Hình thức quảng cáo là trường bắt buộc"),
  adsType: Yup.number().required("Loại quảng cáo là trường bắt buộc"),
  licensing: Yup.number().required("Cấp phép là trường bắt buộc"),
  width: Yup.number().required("Độ dài là trường bắt buộc"),
  height: Yup.number().required("Độ cao là trường bắt buộc"),
  content: Yup.string().required("Lí do thay đổi là trường bắt buộc"),
  images: Yup.mixed().test("fileList", "Vui lòng chọn ít nhất một ảnh", (value: any) => {
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
      {/* Loại bảng quảng cáo */}
      <div className={classes["input-container"]}>
        <label>Loại bảng quảng cáo:</label>
        <Controller
          control={control}
          name='adsType'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <select {...field} className={classes["select-custom"]}>
                <option value=''>Chọn loại bảng quảng cáo</option>
                <option value='0'>Trụ</option>
                <option value='1'>Apfix</option>
              </select>
              {errors.adsType && <div className={classes["error-text"]}>{errors.adsType.message}</div>}
            </div>
          )}
        />
      </div>

      {/* Hình thức quảng cáo */}
      <div className={classes["input-container"]}>
        <label>Hình thức quảng cáo:</label>
        <Controller
          control={control}
          name='adsForm'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <select {...field} className={classes["select-custom"]}>
                <option value=''>Chọn hình thức quảng cáo</option>
                <option value='0'>Cổ động chính trị</option>
                <option value='1'>Văn hóa, xã hội</option>
              </select>
              {errors.adsForm && <div className={classes["error-text"]}>{errors.adsForm.message}</div>}
            </div>
          )}
        />
      </div>

      {/* Cấp phép */}
      <div className={classes["input-container"]}>
        <label>Loại vị trí:</label>
        <Controller
          control={control}
          name='licensing'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <select {...field} className={classes["select-custom"]}>
                <option value=''>Chọn loại cấp phép</option>
                <option value='0'>Chưa cấp phép</option>
                <option value='1'>Đã cấp phép</option>
              </select>
              {errors.licensing && <div className={classes["error-text"]}>{errors.licensing.message}</div>}
            </div>
          )}
        />
      </div>

      {/* Kích thước */}
      <div className={classes["input-container"]}>
        <label>Kích thước:</label>
        <Box className={classes["size-container"]}>
          <Box className={classes["input-small"]}>
            <label>Độ dài: </label>
            <Controller
              control={control}
              name='width'
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <input {...field} type='number' className={classes["input-custom"]} />
                  {errors.width && <div className={classes["error-text"]}>{errors.width.message}</div>}
                </div>
              )}
            />
          </Box>

          <Box className={classes["input-small"]}>
            <label>Độ cao: </label>
            <Controller
              control={control}
              name='height'
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <input {...field} type='number' className={classes["input-custom"]} />
                  {errors.height && <div className={classes["error-text"]}>{errors.height.message}</div>}
                </div>
              )}
            />
          </Box>
        </Box>
      </div>

      {/* Quy hoạch */}
      <div className={classes["input-container"]}>
        <label>Lý do chỉnh sửa:</label>
        <Controller
          control={control}
          name='content'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <textarea {...field} className={classes["textarea-custom"]}></textarea>
              {errors.content && <div className={classes["error-text"]}>{errors.content.message}</div>}
            </div>
          )}
        />
      </div>

      {/* Hình ảnh */}
      <div className={classes["input-container"]}>
        <label>Hình ảnh:</label>
        <Controller
          control={control}
          name='images'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <input
                type='file'
                onChange={(e) => field.onChange(e.target.files)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                multiple={true}
                className={classes["input-custom"]}
              />
              {errors.images && <div className={classes["error-text"]}>{errors.images.message}</div>}
            </div>
          )}
        />
      </div>

      <ButtonSubmit type='submit'>Gửi</ButtonSubmit>
    </form>
  );
};

const ButtonBack = styled(Button)(() => ({
  paddingLeft: "0 !important",
  "&:hover": {
    backgroundColor: "transparent !important"
  }
}));

const IconButtonBack = styled(IconButton)(() => ({
  paddingLeft: "0 !important",
  "&:hover": {
    backgroundColor: "transparent !important"
  }
}));

export const AdvertiseEdit = () => {
  const navigate = useNavigate();
  const infoContract = advertiseDetail.contracts[0];

  const goBack = () => {
    navigate(`${routes.admin.advertises.ofLocation}`);
  };

  return (
    <Box>
      <Header />
      <div className={classes["advertise-edit-container"]}>
        <Sidebar></Sidebar>
        <Box className={classes["container-body"]}>
          <ButtonBack onClick={() => goBack()}>
            <IconButtonBack size='medium'>
              <FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>
            </IconButtonBack>
            Trở về
          </ButtonBack>

          <Box>
            <h2>Thông tin công ty</h2>
            <InfoContract data={infoContract} />
            <Typography>
              <span className={classes["title"]}>Ngày bắt đầu hợp đồng: </span> <span>{infoContract.startAt}</span>
            </Typography>
            <Typography>
              <span className={classes["title"]}>Ngày kết thúc hợp đồng: </span> <span>{infoContract.endAt}</span>
            </Typography>
          </Box>

          <Box mt='30px'>
            <h2>Thông tin quảng cáo</h2>
            <MyForm />
          </Box>
        </Box>
      </div>
    </Box>
  );
};
