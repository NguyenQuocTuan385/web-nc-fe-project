import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Backdrop, Box, Button, Card, CircularProgress, TextField } from "@mui/material";
import Heading6 from "components/common/text/Heading6";
import { DateTimePicker } from "@mui/x-date-pickers";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";
import classes from "./styles.module.scss";
import UploadImage from "components/common/UploadImage";
import { useNavigate } from "react-router-dom";
import ContractService from "services/contract";
import { PutContract } from "models/contract";
import dayjs from "dayjs";

interface FormData {
  signDate: string;
  endDate: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  images: any[];
}

interface PropsData {
  contractId: number;
}

function ContractDetailForm(propsData: PropsData) {
  const navigate = useNavigate();
  const [createLoading, setCreateLoading] = useState(false);
  const schema = useMemo(() => {
    return yup.object().shape({
      signDate: yup.string().required("Vui lòng nhập ngày ký hợp đồng"),
      endDate: yup.string().required("Vui lòng nhập ngày hết hạn hợp đồng"),
      name: yup.string().required("Vui lòng nhập tên công ty"),
      email: yup.string().required("Vui lòng nhập email công ty"),
      phone: yup.string().required("Vui lòng nhập số điện thoại công ty"),
      address: yup.string().required("Vui lòng nhập địa chỉ công ty"),
      images: yup.array().required("Thêm ảnh")
    });
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const contractSubmitHandler = async (data: any) => {
    setCreateLoading(true);
    const files = data.images;
    const formSubmit: FormData = {
      ...data,
      images: []
    };
    console.log(files);
    await Promise.all(
      files.map(async (file: any) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "test-react-uploads-unsigned");
        formData.append("api_key", process.env.REACT_APP_API_KEY_CLOUDINARY as string);

        const URL = process.env.REACT_APP_URL_CLOUDINARY as string;
        const uploadDataResult = await fetch(URL, {
          method: "POST",
          body: formData
        }).then((res) => res.json());

        formSubmit.images.push(uploadDataResult.secure_url);
      })
    );

    // Now formData has all uploaded image URLs
    const newContract: PutContract = {
      companyName: formSubmit.name,
      companyEmail: formSubmit.email,
      companyAddress: formSubmit.address,
      companyPhone: formSubmit.phone,
      images: formSubmit.images[0],
      startAt: dayjs(formSubmit.signDate).format("YYYY-MM-DD hh:mm:ss"),
      endAt: dayjs(formSubmit.endDate).format("YYYY-MM-DD hh:mm:ss"),
      advertiseId: propsData.contractId
    };
    ContractService.createContract(newContract)
      .then((res) => {
        setCreateLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setCreateLoading(false);
        console.log(e);
      });
  };

  return (
    <form onSubmit={handleSubmit(contractSubmitHandler)}>
      <Backdrop open={createLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Card className={classes.cardContainer}>
        <Box className={classes.formGroup}>
          <Heading6 id='contract'>Thông tin về hợp đồng</Heading6>
          <Heading6 fontWeight={100} $colorName='--gray-20'>
            Thêm các thông tin về ngày ký và thời hạn của hợp đồng
          </Heading6>
        </Box>
        <Box className={clsx(classes.formGroup, classes.datePickGroup)}>
          <Controller
            defaultValue=''
            control={control}
            name='signDate'
            aria-invalid={errors.signDate ? "true" : "false"}
            rules={{ required: true }}
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <>
                <DateTimePicker
                  inputRef={ref}
                  className={classes.datePickField}
                  label='Thời gian ký hợp đồng'
                  {...field}
                  slotProps={{
                    textField: {
                      required: true,
                      error: invalid
                    }
                  }}
                />
                <span className={classes.errorText}>{error?.message}</span>
              </>
            )}
          />
          <Controller
            defaultValue=''
            control={control}
            name='endDate'
            aria-invalid={errors.endDate ? "true" : "false"}
            rules={{ required: true }}
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <>
                <DateTimePicker
                  inputRef={ref}
                  className={classes.datePickField}
                  label='Thời gian hết hạn hợp đồng'
                  {...field}
                  slotProps={{
                    textField: {
                      required: true,
                      error: invalid
                    }
                  }}
                />
                <span className={classes.errorText}>{error?.message}</span>
              </>
            )}
          />
        </Box>
      </Card>
      <Card className={classes.cardContainer}>
        <Box className={classes.formGroup}>
          <Heading6 id='company'>Thông tin về công ty</Heading6>
          <Heading6 fontWeight={100} $colorName='--gray-20'>
            Thêm các thông tin chi tiết về công ty muốn ký hợp đồng với bảng quảng cáo này
          </Heading6>
        </Box>

        <Box className={clsx(classes.formGroup, classes.textFieldGroup)}>
          <TextField
            key={"Tên công ty"}
            className={classes.textField}
            fullWidth
            margin='normal'
            label='Tên công ty'
            {...register("name")}
            aria-invalid={errors.name ? "true" : "false"}
            error={Boolean(errors?.name)}
          />
          <p className={classes.errorText}>{errors?.name?.message}</p>
          <TextField
            className={classes.textField}
            fullWidth
            label='Email công ty'
            margin='normal'
            {...register("email")}
            error={Boolean(errors?.email)}
          />
          <p className={classes.errorText}>{errors?.email?.message}</p>

          <TextField
            className={classes.textField}
            fullWidth
            label='Số điện thoại công ty'
            margin='normal'
            {...register("phone")}
            error={Boolean(errors?.phone)}
          />
          <p className={classes.errorText}>{errors?.phone?.message}</p>

          <TextField
            className={classes.textField}
            fullWidth
            label='Địa chỉ công ty'
            margin='normal'
            {...register("address")}
            error={Boolean(errors?.address)}
          />
          <p className={classes.errorText}>{errors?.address?.message}</p>
        </Box>
      </Card>
      <Card>
        <Box>
          <Box className={classes.formGroup}>
            <Heading6 id='image'>Hình ảnh bảng quảng cáo</Heading6>
            <Heading6 fontWeight={100} $colorName='--gray-20'>
              Thêm ảnh của bảng quảng cáo tại đây
            </Heading6>
          </Box>
          <Box className={classes.dropZone}>
            <Controller
              name='images'
              control={control}
              render={({ field }) => (
                <UploadImage
                  files={field.value}
                  errorMessage={errors.images?.message}
                  onChange={(value) => field.onChange(value)}
                  maxFiles={1}
                  padding={"20px"}
                />
              )}
            />
          </Box>
        </Box>
      </Card>
      <div className={classes.stickyFooterContainer}>
        <div className={classes.phantom} />
        <div className={classes.stickyFooterItem}>
          <Button variant='contained' className={classes.cancelButton}>
            Hủy bỏ
          </Button>
          <Button variant='contained' type='submit'>
            Tạo hợp đồng
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ContractDetailForm;
