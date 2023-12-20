import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, Card, TextField } from "@mui/material";
import Heading6 from "components/common/text/Heading6";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import classes from "./styles.module.scss";
import images from "config/images";

function ContractDetailForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [preview, setPreview] = useState<string>();
  const [isFileUploaded, setIsFileUploaded] = useState<Boolean>(false);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      maxFiles: 1,
      accept: {
        "image/*": [],
      },
      onDrop: (files) => {
        setValue("file", files);
        setPreview(URL.createObjectURL(files[0]));
        setIsFileUploaded(true);
      },
    });

  const contractSubmitHandler = async (data: any) => {
    console.log(data);
    const formData = new FormData();
    const file = data.file[0];

    formData.append("file", file);
    formData.append("upload_preset", "test-react-uploads-unsigned");
    formData.append("api_key", "487343349115581");

    const URL = "https://api.cloudinary.com/v1_1/dacvpgdfi/image/upload";
    const uploadDataResult = await fetch(URL, {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    console.log(uploadDataResult.secure_url);
  };

  return (
    <form onSubmit={handleSubmit(contractSubmitHandler)}>
      <Card className={classes.cardContainer}>
        <Box className={classes.formGroup}>
          <Heading6 id="contract">Thông tin về hợp đồng</Heading6>
          <Heading6 fontWeight={100} $colorName="--gray-20">
            Thêm các thông tin về ngày ký và thời hạn của hợp đồng
          </Heading6>
        </Box>

        <Box className={clsx(classes.formGroup, classes.datePickGroup)}>
          <Controller
            control={control}
            name="signDate"
            aria-invalid={errors.signDate ? "true" : "false"}
            rules={{ required: true }}
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error },
            }) => (
              <>
                <DateTimePicker
                  inputRef={ref}
                  className={classes.datePickField}
                  label="Thời gian ký hợp đồng"
                  {...field}
                />
                <>
                  {invalid ? (
                    <span className={classes.errorText}>
                      Vui lòng điền ngày ký hợp đồng
                    </span>
                  ) : (
                    <></>
                  )}
                </>
              </>
            )}
          />

          <Controller
            control={control}
            name="endDate"
            aria-invalid={errors.endDate ? "true" : "false"}
            rules={{ required: true }}
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error },
            }) => (
              <>
                <DateTimePicker
                  inputRef={ref}
                  className={classes.datePickField}
                  label="Thời gian hết hạn hợp đồng"
                  {...field}
                />
                <>
                  {invalid ? (
                    <span className={classes.errorText}>
                      Vui lòng điền ngày hết hạn hợp đồng
                    </span>
                  ) : (
                    <></>
                  )}
                </>
              </>
            )}
          />
        </Box>
      </Card>

      <Card className={classes.cardContainer}>
        <Box className={classes.formGroup}>
          <Heading6 id="company">Thông tin về công ty</Heading6>
          <Heading6 fontWeight={100} $colorName="--gray-20">
            Thêm các thông tin chi tiết về công ty muốn ký hợp đồng với bảng
            quảng cáo này
          </Heading6>
        </Box>

        <Box className={clsx(classes.formGroup, classes.textFieldGroup)}>
          <TextField
            key={"Tên công ty"}
            className={classes.textField}
            fullWidth
            margin="normal"
            label="Tên công ty"
            {...register("name", { required: true, maxLength: 50 })}
            aria-invalid={errors.name ? "true" : "false"}
          />
          <>
            {errors.name && errors.name.type === "required" && (
              <p className={classes.errorText}>Vui lòng điền tên công ty</p>
            )}
            {errors.name && errors.name.type === "maxLength" && (
              <span className={classes.errorText}>
                Vượt quá chiều dài tối đa (50 ký tự)
              </span>
            )}
          </>
          <TextField
            className={classes.textField}
            fullWidth
            label="Email công ty"
            margin="normal"
            {...register("email", { required: true, maxLength: 50 })}
          />
          <>
            {errors.email && errors.email.type === "required" && (
              <span className={classes.errorText}>
                Vui lòng điền email của công ty
              </span>
            )}
            {errors.email && errors.email.type === "maxLength" && (
              <span className={classes.errorText}>
                Vượt quá chiều dài tối đa (50 ký tự)
              </span>
            )}
          </>
          <TextField
            className={classes.textField}
            fullWidth
            label="Số điện thoại công ty"
            margin="normal"
            {...register("phone", { required: true, maxLength: 50 })}
          />
          <>
            {errors.phone && errors.phone.type === "required" && (
              <span className={classes.errorText}>
                Vui lòng điền số điện thoại của công ty
              </span>
            )}
            {errors.phone && errors.phone.type === "maxLength" && (
              <span className={classes.errorText}>
                Vượt quá chiều dài tối đa (50 ký tự)
              </span>
            )}
          </>
          <TextField
            className={classes.textField}
            fullWidth
            label="Địa chỉ công ty"
            margin="normal"
            {...register("address", { required: true, maxLength: 50 })}
          />
          <>
            {errors.address && errors.address.type === "required" && (
              <span className={classes.errorText}>
                Vui lòng điền địa chỉ của công ty
              </span>
            )}
            {errors.address && errors.address.type === "maxLength" && (
              <span className={classes.errorText}>
                Vượt quá chiều dài tối đa (50 ký tự)
              </span>
            )}
          </>
        </Box>
      </Card>

      <Card>
        <Box>
          <Box className={classes.formGroup}>
            <Heading6 id="image">Hình ảnh bảng quảng cáo</Heading6>
            <Heading6 fontWeight={100} $colorName="--gray-20">
              Thêm ảnh của bảng quảng cáo tại đây
            </Heading6>
          </Box>
          <Box className={classes.dropZone}>
            <Controller
              name="fileUpload"
              control={control}
              render={() => (
                <div {...getRootProps({ className: classes.dropzone })}>
                  <input
                    className="input-zone"
                    {...getInputProps()}
                    type="file"
                    name="fileUpload"
                  />
                  <div className={classes.dropzoneContent}>
                    {isDragActive ? (
                      <div>
                        <img
                          src={images.dropFileIcon}
                          alt="upload icon"
                          className={classes.uploadImageIcon}
                        />
                        <p className={classes.dropzoneText}>Thả ở đây</p>
                      </div>
                    ) : (
                      <div>
                        <img
                          src={images.uploadImageIcon}
                          alt="upload icon"
                          className={classes.uploadImageIcon}
                        />
                        <p className={classes.dropzoneText}>
                          Kéo ảnh vào đây hoặc nhấn vào đây để chọn ảnh
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            />
            {isFileUploaded ? (
              <Box className={classes.formGroup}>
                <Heading6>Ảnh đã thêm</Heading6>

                <Card
                  className={classes.imagePreviewCardContainer}
                  variant="outlined"
                >
                  <img src={preview} className={classes.imagePreview} />
                </Card>
              </Box>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </Card>

      <div className={classes.stickyFooterContainer}>
        <div className={classes.phantom} />
        <div className={classes.stickyFooterItem}>
          <Button variant="contained" className={classes.cancelButton}>
            Hủy bỏ
          </Button>
          <Button variant="contained" type="submit">
            Tạo hợp đồng
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ContractDetailForm;
