import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Typography
} from "@mui/material";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { InfoContract } from "../AdvertiseDetail/components/InfoContract";
import { Header } from "components/common/Header";
import SideBarWard from "components/admin/SidebarWard";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";
import { Advertise, AdvertiseEditRequest, AdvertiseType } from "models/advertise";
import UploadImage from "components/common/UploadImage";
import userDetails from "userDetails.json";
import ContractService from "services/contract";
import AdvertiseTypeService from "services/advertiseType";
import AdvertiseEditService from "services/advertiseEdit";
import Heading2 from "components/common/text/Heading2";
import Editor from "components/common/Editor/EditWithQuill";

interface FormData {
  licensing: number;
  height: number;
  width: number;
  adsTypeId: number;
  locationId: number;
  userId: number;
  pillarQuantity: number;
  content: string;
  imageUrls: any[];
}

const schema: any = Yup.object().shape({
  licensing: Yup.boolean().required("Tình trạng cấp phép là trường bắt buộc"),
  width: Yup.number().required("Độ dài là trường bắt buộc"),
  height: Yup.number().required("Độ cao là trường bắt buộc"),
  adsTypeId: Yup.number().required("Loại bảng quảng cáo là trường bắt buộc"),
  pillarQuantity: Yup.number().required("Số lượng trụ/bảng là trường bắt buộc"),
  content: Yup.string().required("Lí do thay đổi là trường bắt buộc"),
  imageUrls: Yup.array().required("Vui lòng chọn ít nhất 1 ảnh")
});

const ButtonSubmit = styled(Button)(
  () => `
  background-color: #389B42 !important;
  padding: 10px 15px !important;
  color: #fff !important;
  float: right;
`
);

interface FormEditAdvertiseProps {
  data: any;
  adsTypes: AdvertiseType[];
  createAdvertiseEditRequest: (isSuccess: boolean) => void;
  locationId: number;
  advertiseId: number;
}

const MyForm: React.FC<FormEditAdvertiseProps> = ({
  data,
  adsTypes,
  createAdvertiseEditRequest,
  locationId,
  advertiseId
}: any) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  // Khi có login thì lấy thông tin từ login
  const userInfo = { ...userDetails };

  const [openDialog, setOpenDialog] = useState(false);
  const [originalImages, setOriginalImages] = useState(data.images);
  const [selectedImages, setSelectedImages] = useState<Array<any>>([]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEmitSuccessState = (isSuccess: boolean) => {
    createAdvertiseEditRequest(isSuccess);
  };

  const createAdvertiseEdit = async (
    advertiseId: number,
    advertiseEditRequest: AdvertiseEditRequest
  ) => {
    AdvertiseEditService.createAdvertiseEditRequest(locationId, advertiseEditRequest)
      .then((res) => {
        handleEmitSuccessState(true);
      })
      .catch((err) => {
        handleEmitSuccessState(false);
        console.log(err);
      });
  };

  const submitHandler = async (data: any) => {
    const files = data.imageUrls;
    const formSubmit: FormData = {
      ...data,
      imageUrls: []
    };

    let savedImageUrls: string = "";

    if (selectedImages.length > 0) {
      await Promise.all(
        files.map(async (file: any) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "test-react-uploads-unsigned");
          formData.append("api_key", "487343349115581");

          const URL = "https://api.cloudinary.com/v1_1/dacvpgdfi/image/upload";
          const uploadDataResult = await fetch(URL, {
            method: "POST",
            body: formData
          }).then((res) => res.json());

          formSubmit.imageUrls.push(uploadDataResult.secure_url);
        })
      );

      savedImageUrls = formSubmit.imageUrls[0];
    } else {
      formSubmit.imageUrls.push(files[0]);
    }

    const dataSubmit = {
      ...formSubmit,
      imageUrls: savedImageUrls.length > 0 ? savedImageUrls : formSubmit.imageUrls[0],
      userId: userInfo.id,
      locationId: locationId
    };

    createAdvertiseEdit(locationId, dataSubmit);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {/* Loại bảng quảng cáo */}
      <Box className={classes["input-container"]}>
        <label>Loại bảng quảng cáo:</label>
        <Controller
          control={control}
          name='adsTypeId'
          defaultValue={data.adsTypeId}
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <select {...field} {...register("adsTypeId")} className={classes["select-custom"]}>
                {adsTypes.length > 0 &&
                  adsTypes.map((adsType: AdvertiseType) => {
                    return (
                      <option value={adsType.id} key={adsType.id}>
                        {adsType.name}
                      </option>
                    );
                  })}
              </select>
              {errors.adsTypeId && (
                <div className={classes["error-text"]}>{errors.adsTypeId.message}</div>
              )}
            </div>
          )}
        />
      </Box>

      {/* Cấp phép */}
      <Box className={classes["input-container"]}>
        <label>Tình trạng cấp phép:</label>
        <Controller
          control={control}
          name='licensing'
          defaultValue={data.licensing}
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <select {...field} {...register("licensing")} className={classes["select-custom"]}>
                <option value='false'>Chưa cấp phép</option>
                <option value='true'>Đã cấp phép</option>
              </select>
              {errors.licensing && (
                <div className={classes["error-text"]}>{errors.licensing.message}</div>
              )}
            </div>
          )}
        />
      </Box>

      {/* Kích thước */}
      <Box className={classes["input-container"]}>
        <label>Kích thước:</label>
        <Box className={classes["size-container"]}>
          <Box className={classes["input-small"]}>
            <label>Độ dài: </label>
            <Controller
              control={control}
              name='width'
              defaultValue={data.width}
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <input
                    {...field}
                    {...register("width")}
                    type='number'
                    className={classes["input-custom"]}
                  />
                  {errors.width && (
                    <div className={classes["error-text"]}>{errors.width.message}</div>
                  )}
                </div>
              )}
            />
          </Box>

          <Box className={classes["input-small"]}>
            <label>Độ cao: </label>
            <Controller
              control={control}
              name='height'
              defaultValue={data.height}
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <input
                    {...field}
                    {...register("height")}
                    type='number'
                    className={classes["input-custom"]}
                  />
                  {errors.height && (
                    <div className={classes["error-text"]}>{errors.height.message}</div>
                  )}
                </div>
              )}
            />
          </Box>
        </Box>
      </Box>

      {/* Số lượng trụ/ bảng */}
      <Box className={classes["input-container"]}>
        <label>Số lượng trụ:</label>
        <Controller
          control={control}
          name='pillarQuantity'
          defaultValue={data.pillarQuantity ? data.pillarQuantity : 0}
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <input
                {...field}
                {...register("pillarQuantity")}
                type='number'
                className={classes["input-custom"]}
              />
              {errors.pillarQuantity && (
                <div className={classes["error-text"]}>{errors.pillarQuantity.message}</div>
              )}
            </div>
          )}
        />
      </Box>

      {/* Lý do chỉnh sửa */}
      <Box className={classes["input-container"]}>
        <label>Lý do chỉnh sửa:</label>
        {/* <Controller
          control={control}
          name='content'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <textarea
                {...field}
                {...register("content")}
                className={classes["textarea-custom"]}
              ></textarea>
              {errors.content && (
                <div className={classes["error-text"]}>{errors.content.message}</div>
              )}
            </div>
          )}
        /> */}
        <Controller
          control={control}
          name='content'
          defaultValue=''
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              {/* Replace textarea with the Editor component */}
              <Editor
                placeholder='Nhập lí do chỉnh sửa...'
                getValueOnChange={(html: string) => field.onChange(html)}
                content={field.value}
                isAllowedType={true}
              />
              {errors.content && (
                <div className={classes["error-text"]}>{errors.content.message}</div>
              )}
            </div>
          )}
        />
      </Box>

      {/* Hình ảnh */}
      <Box className={classes["input-container"]}>
        <label>Hình ảnh:</label>
        <Controller
          control={control}
          name='imageUrls'
          defaultValue={originalImages}
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <Box display={"flex"} flexWrap={"wrap"} className={classes["images-wrapper"]}>
                {selectedImages.length > 0 &&
                  selectedImages.map((image: string, index: number) => {
                    return (
                      <img
                        src={image}
                        width={"200px"}
                        height={"150px"}
                        style={{
                          borderRadius: "8px",
                          margin: "0 15px 10px 0",
                          border: "1px solid #ccc"
                        }}
                        alt='Image Loation'
                      />
                    );
                  })}

                {data.images.length > 0 &&
                  selectedImages.length < 1 &&
                  data.images.map((image: string, index: number) => {
                    return (
                      <img
                        src={image}
                        width={"200px"}
                        height={"150px"}
                        style={{
                          borderRadius: "8px",
                          margin: "0 15px 10px 0",
                          border: "1px solid #ccc"
                        }}
                        alt='Image Loation'
                      />
                    );
                  })}
              </Box>
              <Button
                onClick={handleOpenDialog}
                style={{ backgroundColor: "var(--blue-200)", marginTop: "15px" }}
              >
                Thay đổi ảnh
              </Button>
              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Chọn ảnh</DialogTitle>
                <DialogContent>
                  <UploadImage
                    files={field.value}
                    maxFiles={1}
                    errorMessage={errors.imageUrls?.message}
                    onChange={(value) => {
                      field.onChange(value);

                      // Chuyển đổi giá trị thành mảng
                      const fileList = Array.isArray(value) ? value : [value];
                      const imageUrls = fileList.map((file) => {
                        return URL.createObjectURL(file);
                      });

                      setSelectedImages(imageUrls);
                    }}
                    borderRadius={"8px"}
                  />
                </DialogContent>
                <DialogActions style={{ padding: "0 24px" }}>
                  <Button
                    onClick={() => {
                      field.onChange(originalImages);
                      setSelectedImages([]);
                      handleCloseDialog();
                    }}
                    style={{ color: "red" }}
                  >
                    {selectedImages.length > 0 ? "Khôi phục ảnh ban đầu" : "Hủy"}
                  </Button>

                  <Button onClick={handleCloseDialog} style={{ color: "green" }}>
                    Lưu thay đổi
                  </Button>
                </DialogActions>
              </Dialog>

              {errors.imageUrls && (
                <div className={classes["error-text"]}>{errors.imageUrls.message}</div>
              )}
            </div>
          )}
        />
      </Box>

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

interface InfoContract {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  startAt: string;
  endAt: string;
}

export const AdvertiseEdit = () => {
  const navigate = useNavigate();
  const { locationId, advertiseId } = useParams<{ locationId: string; advertiseId: string }>();

  // const infoContract = advertiseDetail.contracts[0];
  const [infoContract, setInfoContract] = useState<InfoContract | null>(null);
  const [infoAds, setInfoAds] = useState<Advertise | null>(null);
  const [adsTypes, setAdsTypes] = useState([]);
  const [isCreateSuccess, setIsCreateSuccess] = useState<boolean | null>(null);

  const goBack = () => {
    navigate(`${routes.admin.advertises.ofLocation.replace(":id", `${locationId}`)}`);
  };

  useEffect(() => {
    const getContractByAdvertiseId = async () => {
      ContractService.getContractsByAdvertiseOne(Number(advertiseId), {})
        .then((res) => {
          setInfoContract({
            companyName: res.companyName,
            companyAddress: res.companyAddress,
            companyEmail: res.companyEmail,
            companyPhone: res.companyPhone,
            startAt: res.startAt,
            endAt: res.endAt
          });

          setInfoAds({
            ...res.advertise,
            images: [res.advertise.images]
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getContractByAdvertiseId();
  }, []);

  useEffect(() => {
    AdvertiseTypeService.getAllAdvertiseType({})
      .then((res) => {
        setAdsTypes(res.content);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleGetSuccessState = (isSuccess: boolean) => {
    setIsCreateSuccess(isSuccess);
  };

  return (
    <Box>
      <Header />
      <div className={classes["advertise-edit-container"]}>
        <SideBarWard></SideBarWard>
        <Box className={classes["container-body"]}>
          <ButtonBack onClick={() => goBack()}>
            <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
            Trở về
          </ButtonBack>

          <Box>
            <Heading2 fontSize={"24px"} fontWeight={600}>
              Thông tin công ty
            </Heading2>
            {infoContract && <InfoContract data={infoContract} />}
            {infoContract && (
              <Typography>
                <span className={classes.title}>Ngày bắt đầu hợp đồng: </span>{" "}
                <span>{infoContract.startAt}</span>
              </Typography>
            )}
            {infoContract && (
              <Typography>
                <span className={classes.title}>Ngày kết thúc hợp đồng: </span>{" "}
                <span>{infoContract.endAt}</span>
              </Typography>
            )}
          </Box>

          <Box mt='30px'>
            <Heading2 fontSize={"24px"} fontWeight={600}>
              Thông tin quảng cáo
            </Heading2>
            {infoAds && (
              <MyForm
                data={infoAds}
                createAdvertiseEditRequest={handleGetSuccessState}
                adsTypes={adsTypes}
                locationId={Number(locationId)}
                advertiseId={Number(advertiseId)}
              />
            )}
          </Box>

          <Snackbar
            open={isCreateSuccess !== null}
            autoHideDuration={3000}
            onClose={() => setIsCreateSuccess(null)}
          >
            <Alert
              severity={isCreateSuccess ? "success" : "error"}
              onClose={() => setIsCreateSuccess(null)}
            >
              {isCreateSuccess ? "Yêu cầu chỉnh sửa thành công" : "Yêu cầu chỉnh sửa thất bại"}
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </Box>
  );
};
