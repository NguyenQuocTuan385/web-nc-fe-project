import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Snackbar,
  TextField,
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
import SideBarWard from "components/admin/SidebarWard";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";
import { Advertise, AdvertiseEditRequest, AdvertiseType } from "models/advertise";
import UploadImage from "components/common/UploadImage";
import ContractService from "services/contract";
import AdvertiseTypeService from "services/advertiseType";
import AdvertiseEditService from "services/advertiseEdit";
import Heading2 from "components/common/text/Heading2";
import Editor from "components/common/Editor/EditWithQuill";
import useIntercepts from "hooks/useIntercepts";
import { User } from "models/user";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { ERole } from "models/general";
import ParagraphBody from "components/common/text/ParagraphBody";
import AdvertiseService from "services/advertise";
import SideBarDCMS from "components/admin/SidebarDCMS";
import { loading } from "reduxes/Loading";

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

  const currentUser: User = useSelector(selectCurrentUser);

  const [openDialog, setOpenDialog] = useState(false);
  const [originalImages, setOriginalImages] = useState(data.images);
  const [selectedImages, setSelectedImages] = useState<Array<any>>([]);
  const isDepartment = currentUser.role.id === ERole.DEPARTMENT ? true : false;
  const intercept = useIntercepts();
  const dispatch = useDispatch();
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEmitSuccessState = (isSuccess: boolean) => {
    createAdvertiseEditRequest(isSuccess);
  };

  const userCurrent: User = useSelector(selectCurrentUser);
  const createAdvertiseEdit = async (
    advertiseId: number,
    advertiseEditRequest: AdvertiseEditRequest
  ) => {
    dispatch(loading(true));
    if (userCurrent.role.id === ERole.DEPARTMENT) {
      AdvertiseEditService.editAdvertiseRequest(advertiseId, advertiseEditRequest, intercept)
        .then((res) => {
          handleEmitSuccessState(true);
        })
        .catch((err) => {
          handleEmitSuccessState(false);
          console.log(err);
        })
        .finally(() => dispatch(loading(false)));
    } else {
      AdvertiseEditService.createAdvertiseEditRequest(advertiseId, advertiseEditRequest, intercept)
        .then((res) => {
          handleEmitSuccessState(true);
        })
        .catch((err) => {
          handleEmitSuccessState(false);
          console.log(err);
        })
        .finally(() => dispatch(loading(false)));
    }
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
      userId: currentUser.id,
      locationId: locationId
    };

    createAdvertiseEdit(advertiseId, dataSubmit);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {/* Loại bảng quảng cáo */}
      <Box className={classes["input-container"]}>
        <label>Loại bảng quảng cáo:</label>
        <Controller
          control={control}
          name='adsTypeId'
          defaultValue={data.adsType.id}
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <Select
                {...field}
                {...register("adsTypeId")}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                fullWidth
              >
                <MenuItem value='' disabled>
                  Chọn hình thức quảng cáo
                </MenuItem>
                {adsTypes.length > 0 &&
                  adsTypes.map((adsType: AdvertiseType) => (
                    <MenuItem value={adsType.id} key={adsType.id}>
                      {adsType.name}
                    </MenuItem>
                  ))}
              </Select>
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
              <Select
                {...field}
                {...register("licensing")}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                fullWidth
              >
                <MenuItem value='' disabled>
                  Chọn tình trạng cấp phép
                </MenuItem>
                <MenuItem value='false'>Chưa cấp phép</MenuItem>
                <MenuItem value='true'>Đã cấp phép</MenuItem>
              </Select>
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
            <Controller
              control={control}
              name='width'
              defaultValue={data.width}
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <TextField
                    required
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>m</InputAdornment>
                    }}
                    id='outlined-required'
                    label='Độ dài'
                    type='number'
                    {...field}
                    {...register("width")}
                    fullWidth
                  />
                  {errors.width && (
                    <div className={classes["error-text"]}>{errors.width.message}</div>
                  )}
                </div>
              )}
            />
          </Box>

          <Box className={classes["input-small"]}>
            <Controller
              control={control}
              name='height'
              defaultValue={data.height}
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <TextField
                    required
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>m</InputAdornment>
                    }}
                    id='outlined-required'
                    label='Độ cao'
                    type='number'
                    {...field}
                    {...register("height")}
                    fullWidth
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
              <TextField
                required
                id='outlined-required'
                {...field}
                {...register("pillarQuantity")}
                fullWidth
                type='number'
              />
              {errors.pillarQuantity && (
                <div className={classes["error-text"]}>{errors.pillarQuantity.message}</div>
              )}
            </div>
          )}
        />
      </Box>

      {/* Lý do chỉnh sửa */}
      {/* {(currentUser.role.id === ERole.WARD || currentUser.role.id === ERole.DISTRICT) && ( */}
      <Box className={classes["input-container"]}>
        <label>Lý do chỉnh sửa:</label>
        <Controller
          control={control}
          // disabled={isDepartment}
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
      {/* )} */}

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
                        alt='img Loation'
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
                        alt='img Loation'
                      />
                    );
                  })}
              </Box>
              <Button onClick={handleOpenDialog} variant='contained' style={{ marginTop: "15px" }}>
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

      <ButtonSubmit type='submit'>
        {currentUser.role.id === ERole.DEPARTMENT ? "Cập nhật" : "Gửi"}
      </ButtonSubmit>
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
  images: string;
  startAt: string;
  endAt: string;
}

export const AdvertiseEdit = () => {
  const navigate = useNavigate();
  const { locationId, advertiseId } = useParams<{ locationId: string; advertiseId: string }>();
  const currentUser: User = useSelector(selectCurrentUser);
  const [infoContract, setInfoContract] = useState<InfoContract | null>(null);
  const [infoAds, setInfoAds] = useState<Advertise | null>(null);
  const [adsTypes, setAdsTypes] = useState([]);
  const [isCreateSuccess, setIsCreateSuccess] = useState<boolean | null>(null);
  const intercept = useIntercepts();
  const dispatch = useDispatch();
  const goBack = () => {
    if (currentUser.role.id === ERole.WARD)
      navigate(`${routes.admin.advertises.wardOfLocation.replace(":id", `${locationId}`)}`);
    else if (currentUser.role.id === ERole.DISTRICT)
      navigate(`${routes.admin.advertises.districtOfLocation.replace(":id", `${locationId}`)}`);
    else navigate(`${routes.admin.locations.dcmsDetail.replace(":id", `${locationId}`)}`);
  };

  useEffect(() => {
    const getContractByAdvertiseId = async () => {
      dispatch(loading(true));
      ContractService.findContractLicensingByAdvertiseId(Number(advertiseId), {}, intercept)
        .then((res) => {
          setInfoContract({
            companyName: res.companyName,
            companyAddress: res.companyAddress,
            companyEmail: res.companyEmail,
            companyPhone: res.companyPhone,
            images: res.images,
            startAt: res.startAt,
            endAt: res.endAt
          });

          setInfoAds({
            ...res.advertise,
            images: [res.advertise.images]
          });
        })
        .catch((e) => {
          // Lỗi khi không có contract --> Call API lấy chi tiết quảng cáo
          AdvertiseService.getAdvertisesById(Number(advertiseId), intercept).then((res) => {
            setInfoAds({
              ...res,
              images: [res.images]
            });
          });
          console.log(e);
        })
        .finally(() => dispatch(loading(false)));
    };
    getContractByAdvertiseId();
  }, []);

  useEffect(() => {
    dispatch(loading(true));
    AdvertiseTypeService.getAllAdvertiseType({}, intercept)
      .then((res) => {
        setAdsTypes(res.content);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => dispatch(loading(false)));
  }, []);

  const handleGetSuccessState = (isSuccess: boolean) => {
    setIsCreateSuccess(isSuccess);
  };

  return (
    <Box>
      {/* <Header /> */}
      <div className={classes["advertise-edit-container"]}>
        {currentUser.role.id === ERole.WARD || currentUser.role.id === ERole.DISTRICT ? (
          <SideBarWard>
            <Box className={classes["container-body"]}>
              <ButtonBack onClick={() => goBack()}>
                <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
                Trở về
              </ButtonBack>

              {!!infoContract && (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {infoContract && (
                      <img
                        className={classes.image}
                        src={infoContract.images}
                        alt='Hình ảnh công ty'
                        width={"50%"}
                        height={"250px"}
                      />
                    )}
                    <Box
                      sx={{
                        marginLeft: "24px"
                      }}
                    >
                      <InfoContract data={infoContract} />
                      <Typography>
                        <span className={classes.title}>Ngày bắt đầu hợp đồng: </span>{" "}
                        <span>{infoContract.startAt}</span>
                      </Typography>
                      <Typography>
                        <span className={classes.title}>Ngày kết thúc hợp đồng: </span>{" "}
                        <span>{infoContract.endAt}</span>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {!!infoAds && (
                <Box mt='30px'>
                  <Heading2>Thông tin quảng cáo</Heading2>
                  <MyForm
                    data={infoAds}
                    createAdvertiseEditRequest={handleGetSuccessState}
                    adsTypes={adsTypes}
                    locationId={Number(locationId)}
                    advertiseId={Number(advertiseId)}
                  />
                </Box>
              )}

              {!!infoAds && (
                <Snackbar
                  open={isCreateSuccess !== null}
                  autoHideDuration={3000}
                  onClose={() => setIsCreateSuccess(null)}
                >
                  <Alert
                    severity={isCreateSuccess ? "success" : "error"}
                    onClose={() => setIsCreateSuccess(null)}
                  >
                    {isCreateSuccess
                      ? "Yêu cầu chỉnh sửa thành công"
                      : "Yêu cầu chỉnh sửa thất bại"}
                  </Alert>
                </Snackbar>
              )}

              {!infoAds && !infoContract && (
                <ParagraphBody className={classes.noList}>
                  Không có thông tin bảng quảng cáo
                </ParagraphBody>
              )}
            </Box>
          </SideBarWard>
        ) : (
          <SideBarDCMS>
            <Box className={classes["container-body"]}>
              <ButtonBack onClick={() => goBack()}>
                <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
                Trở về
              </ButtonBack>

              {!!infoContract && (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {infoContract && (
                      <img
                        className={classes.image}
                        src={infoContract.images}
                        alt='Hình ảnh công ty'
                        width={"50%"}
                        height={"250px"}
                      />
                    )}
                    <Box
                      sx={{
                        marginLeft: "24px"
                      }}
                    >
                      <InfoContract data={infoContract} />
                      <Typography>
                        <span className={classes.title}>Ngày bắt đầu hợp đồng: </span>{" "}
                        <span>{infoContract.startAt}</span>
                      </Typography>
                      <Typography>
                        <span className={classes.title}>Ngày kết thúc hợp đồng: </span>{" "}
                        <span>{infoContract.endAt}</span>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {!!infoAds && (
                <Box mt='30px'>
                  <Heading2>Thông tin quảng cáo</Heading2>
                  <MyForm
                    data={infoAds}
                    createAdvertiseEditRequest={handleGetSuccessState}
                    adsTypes={adsTypes}
                    locationId={Number(locationId)}
                    advertiseId={Number(advertiseId)}
                  />
                </Box>
              )}

              {!!infoAds && (
                <Snackbar
                  open={isCreateSuccess !== null}
                  autoHideDuration={3000}
                  onClose={() => setIsCreateSuccess(null)}
                >
                  <Alert
                    severity={isCreateSuccess ? "success" : "error"}
                    onClose={() => setIsCreateSuccess(null)}
                  >
                    {isCreateSuccess
                      ? "Yêu cầu chỉnh sửa thành công"
                      : "Yêu cầu chỉnh sửa thất bại"}
                  </Alert>
                </Snackbar>
              )}

              {!infoAds && !infoContract && (
                <ParagraphBody className={classes.noList}>
                  Không có thông tin bảng quảng cáo
                </ParagraphBody>
              )}
            </Box>
          </SideBarDCMS>
        )}
      </div>
    </Box>
  );
};
