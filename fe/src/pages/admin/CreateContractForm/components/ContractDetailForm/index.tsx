import React, { useCallback, useState } from "react";
import { useForm, SubmitHandler, Form, Controller } from "react-hook-form";
import { Box, Button, Card, TextField } from "@mui/material";
import Heading6 from "components/common/text/Heading6";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useDropzone } from "react-dropzone";
import classes from "./styles.module.scss";
import clsx from "clsx";

function ContractDetailForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [preview, setPreview] = useState<string>();

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragActive,
  } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [],
    },
    onDrop: (files) => {
      setValue("file", files);
      setPreview(URL.createObjectURL(files[0]));
    },
  });

  const contractSubmitHandler = (data: any) => {
    console.log(data);
    // console.log(URL.createObjectURL(data.file[0]));
  };

  return (
    <form onSubmit={handleSubmit(contractSubmitHandler)}>
      <Card className={classes.cardContainer}>
        <Box className={classes.formGroup}>
          <Heading6 id="contract">Thông tin về hợp đồng</Heading6>
          <Heading6 className={classes.lowOpacity}>
            Thêm các thông tin về ngày ký và thời hạn của hợp đồng
          </Heading6>
        </Box>

        <Box className={clsx(classes.formGroup, classes.datePickGroup)}>
          <DateTimePicker
            className={classes.datePickField}
            label="Thời gian ký hợp đồng"
          ></DateTimePicker>
          <DateTimePicker
            className={classes.datePickField}
            label="Thời gian hết hạn hợp đồng"
          ></DateTimePicker>
        </Box>
      </Card>

      <Card className={classes.cardContainer}>
        <Box className={classes.formGroup}>
          <Heading6 id="company">Thông tin về công ty</Heading6>
          <Heading6 className={classes.lowOpacity}>
            Thêm các thông tin chi tiết về công ty muốn ký hợp đồng với bảng
            quảng cáo này
          </Heading6>
        </Box>

        <Box className={clsx(classes.formGroup)}>
          <TextField
            className={classes.textField}
            fullWidth
            margin="normal"
            label="Tên công ty"
            {...register("name", { required: true, maxLength: 2 })}
            helperText={
              <>
                {errors.name && errors.name.type === "required" && (
                  <span className={classes.errorText}>This is required</span>
                )}
                {errors.name && errors.name.type === "maxLength" && (
                  <span className={classes.errorText}>Max length exceeded</span>
                )}
              </>
            }
            aria-invalid={errors.name ? "true" : "false"}
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Email công ty"
            margin="normal"
            {...register("email", { required: true, maxLength: 2 })}
            helperText={
              <>
                {errors.name && errors.name.type === "required" && (
                  <span className={classes.errorText}>This is required</span>
                )}
                {errors.name && errors.name.type === "maxLength" && (
                  <span className={classes.errorText}>Max length exceeded</span>
                )}
              </>
            }
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Số điện thoại công ty"
            margin="normal"
            {...register("phone", { required: true, maxLength: 2 })}
            helperText={
              <>
                {errors.name && errors.name.type === "required" && (
                  <span className={classes.errorText}>This is required</span>
                )}
                {errors.name && errors.name.type === "maxLength" && (
                  <span className={classes.errorText}>Max length exceeded</span>
                )}
              </>
            }
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Địa chỉ công ty"
            margin="normal"
            {...register("address", { required: true, maxLength: 2 })}
            helperText={
              <>
                {errors.name && errors.name.type === "required" && (
                  <span className={classes.errorText}>This is required</span>
                )}
                {errors.name && errors.name.type === "maxLength" && (
                  <span className={classes.errorText}>Max length exceeded</span>
                )}
              </>
            }
          />
        </Box>
      </Card>

      <Card>
        <Box>
          <Box className={classes.formGroup}>
            <Heading6 id="image">Hình ảnh bảng quảng cáo</Heading6>
            <Heading6 className={classes.lowOpacity}>
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
                  <div className="text-center">
                    {isDragActive && !isDragAccept ? (
                      <p className="dropzone-content">Drop File Here</p>
                    ) : (
                      <p className="dropzone-content">
                        Drag’n’drop some files here, or click to select files
                      </p>
                    )}
                  </div>
                  <img src={preview} width={100} height={100} />
                </div>
              )}
            />
          </Box>
        </Box>
      </Card>
    </form>
  );
}

export default ContractDetailForm;
