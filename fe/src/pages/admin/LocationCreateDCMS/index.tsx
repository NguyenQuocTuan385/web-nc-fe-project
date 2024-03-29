import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useParams } from "react-router-dom";

import classes from "./styles.module.scss";
import SideBarDCMS from "components/admin/SidebarDCMS";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import UploadImage from "components/common/UploadImage";
import { useEffect, useState } from "react";
import LocationService from "services/location";
import LocationTypeService from "services/locationType";
import AdvertiseFormService from "services/advertiseForm";
import { LocationCreateRequest, LocationType } from "models/location";
import { AdvertiseForm } from "models/advertise";
import Heading2 from "components/common/text/Heading2";
import useIntercepts from "hooks/useIntercepts";
import { User } from "models/user";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import WardService from "services/ward";
import DistrictService from "services/district";
import { Property } from "models/property";
import MapAdsManagementAdmin from "../MapAdsManagement";
import { loading } from "reduxes/Loading";

interface FormData {
  propertyId: number;
  address: string;
  locationTypeId: number;
  advertiseFormId: number;
  planning: number;
  imageUrls: any[];
  latitude: number;
  longitude: number;
  userId: number;
  districtId: number;
  wardId: number;
}

const schema: any = Yup.object().shape({
  address: Yup.string().required("Địa chỉ là trường bắt buộc"),
  locationTypeId: Yup.number().required("Loại vị trí là trường bắt buộc"),
  advertiseFormId: Yup.number().required("Hình thức quảng cáo là trường bắt buộc"),
  planning: Yup.boolean().required("Quy hoạch là trường bắt buộc"),
  imageUrls: Yup.array().required("Vui lòng chọn ít nhất 1 ảnh"),
  latitude: Yup.number().required("Vĩ độ là bắt buộc"),
  longitude: Yup.number().required("Kinh độ là bắt buộc")
});

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

const ButtonSubmit = styled(Button)(() => ({
  backgroundColor: "#389B42 !important",
  padding: "10px 15px !important",
  color: "#fff !important",
  float: "right"
}));

interface FormCreateLocationProps {
  locationTypes: LocationType[];
  adsForms: AdvertiseForm[];
  intercept: any;
}

const MyForm: React.FC<FormCreateLocationProps> = ({ locationTypes, adsForms, intercept }: any) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const currentUser: User = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);
  const [originalImages, setOriginalImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState<Array<any>>([]);
  const [districts, setDistricts] = useState<Property[]>([]);
  const [wards, setWards] = useState<Property[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<Property | null>(null);
  const [selectedWard, setSelectedWard] = useState<Property | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const createLocation = async (locationCreateRequest: LocationCreateRequest) => {
    LocationService.createLocation(locationCreateRequest, intercept)
      .then((res) => {
        navigate(`${routes.admin.locations.dcms}`);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(loading(false));
      });
  };

  const submitHandler = async (data: any) => {
    dispatch(loading(true));
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

      savedImageUrls = JSON.stringify(formSubmit.imageUrls);
    } else {
      formSubmit.imageUrls.push(JSON.stringify(files));
    }

    const dataSubmit = {
      ...formSubmit,
      image: savedImageUrls.length > 0 ? savedImageUrls : formSubmit.imageUrls[0],
      propertyId: formSubmit.propertyId,
      userId: currentUser.id
    };

    createLocation(dataSubmit);
  };

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

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {/* Khu vực */}
      <Box className={classes["input-container"]}>
        <label>Quận:</label>
        <Controller
          control={control}
          name='districtId'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <Select
                {...field}
                {...register("districtId")}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                fullWidth
                onChange={(e) => {
                  const selectedDistrict = districts.find(
                    (district) => district.id === e.target.value
                  );
                  if (selectedDistrict) {
                    setSelectedDistrict(selectedDistrict);
                  }
                  if (selectedDistrict) {
                    getAllWard(selectedDistrict.id);
                  }
                }}
              >
                <MenuItem>Chọn quận</MenuItem>
                {districts.map((district) => (
                  <MenuItem value={district.id} key={district.id}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.districtId && (
                <div className={classes["error-text"]}>{errors.districtId.message}</div>
              )}
            </div>
          )}
        />
      </Box>

      <Box className={classes["input-container"]}>
        <label>Phường:</label>
        <Controller
          control={control}
          name='wardId'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <Select
                {...field}
                {...register("wardId")}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                fullWidth
                onChange={(e) => {
                  const selectedWard = wards.find((ward) => ward.id === e.target.value);
                  if (selectedWard) {
                    setSelectedWard(selectedWard);
                  }
                }}
              >
                <MenuItem>Chọn phường</MenuItem>
                {wards.map((ward) => (
                  <MenuItem value={ward.id} key={ward.id}>
                    {ward.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.wardId && (
                <div className={classes["error-text"]}>{errors.wardId.message}</div>
              )}
            </div>
          )}
        />
      </Box>

      {/* Địa chỉ */}
      <Box className={classes["input-container"]}>
        <label>Địa chỉ:</label>
        <Controller
          control={control}
          name='address'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <TextField
                required
                id='outlined-required'
                {...field}
                {...register("address")}
                fullWidth
              />

              {errors.address && (
                <div className={classes["error-text"]}>{errors.address.message}</div>
              )}
            </div>
          )}
        />
      </Box>

      {/* Tọa độ */}
      <Box className={classes["input-container"]}>
        <label>Tọa độ:</label>
        <Box className={classes["coordinates-container"]}>
          <Box className={classes["input-small"]}>
            <Controller
              control={control}
              name='latitude'
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <TextField
                    required
                    id='outlined-required'
                    label='Vĩ độ'
                    type='number'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'
                    {...field}
                    {...register("latitude")}
                    fullWidth
                  />

                  {errors.latitude && (
                    <div className={classes["error-text"]}>{errors.latitude.message}</div>
                  )}
                </div>
              )}
            />
          </Box>

          <Box className={classes["input-small"]}>
            <Controller
              control={control}
              name='longitude'
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <TextField
                    required
                    id='outlined-required'
                    label='Tung độ'
                    type='number'
                    InputLabelProps={{ shrink: true }}
                    {...field}
                    {...register("longitude")}
                    fullWidth
                  />
                  {errors.longitude && (
                    <div className={classes["error-text"]}>{errors.longitude.message}</div>
                  )}
                </div>
              )}
            />
          </Box>
        </Box>
      </Box>

      {/* Loại vị trí */}
      <Box className={classes["input-container"]}>
        <label>Loại vị trí:</label>
        <Controller
          control={control}
          name='locationTypeId'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <Select
                {...field}
                {...register("locationTypeId")}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                fullWidth
              >
                <MenuItem>Chọn loại vị trí</MenuItem>
                {locationTypes.length > 0 &&
                  locationTypes.map((locationType: LocationType, index: number) => (
                    <MenuItem value={locationType.id} key={locationType.id}>
                      {locationType.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.locationTypeId && (
                <div className={classes["error-text"]}>{errors.locationTypeId.message}</div>
              )}
            </div>
          )}
        />
      </Box>

      {/* Hình thức quảng cáo */}
      <Box className={classes["input-container"]}>
        <label>Hình thức quảng cáo:</label>
        <Controller
          control={control}
          name='advertiseFormId'
          // defaultValue={data.adsForm.id}
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <Select
                {...field}
                {...register("advertiseFormId")}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                fullWidth
              >
                <MenuItem>Chọn hình thức quảng cáo</MenuItem>
                {adsForms.length > 0 &&
                  adsForms.map((adsForm: AdvertiseForm, index: number) => (
                    <MenuItem value={adsForm.id} key={adsForm.id}>
                      {adsForm.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.advertiseFormId && (
                <div className={classes["error-text"]}>{errors.advertiseFormId.message}</div>
              )}
            </div>
          )}
        />
      </Box>

      {/* Quy hoạch */}
      <Box className={classes["input-container"]}>
        <label>Quy hoạch:</label>
        <Controller
          control={control}
          name='planning'
          // defaultValue={data.planning}
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <Select
                {...field}
                {...register("planning")}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                fullWidth
              >
                <MenuItem>Chọn quy hoạch</MenuItem>
                <MenuItem value='false'>Chưa quy hoạch</MenuItem>
                <MenuItem value='true'>Đã quy hoạch</MenuItem>
              </Select>
              {errors.planning && (
                <div className={classes["error-text"]}>{errors.planning.message}</div>
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

                {/* {JSON.parse(data.images).length > 0 &&
                  selectedImages.length < 1 &&
                  JSON.parse(data.images).map((image: string, index: number) => {
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
                  })} */}
              </Box>
              <Button onClick={handleOpenDialog} style={{ marginTop: "15px" }} variant='contained'>
                Thay đổi ảnh
              </Button>
              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Chọn ảnh</DialogTitle>
                <DialogContent>
                  <UploadImage
                    files={field.value}
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

      <Box className={classes["map-container-button"]}>
        <Box className={classes["map-item"]}>
          <MapAdsManagementAdmin reset={reset} />
        </Box>
        <ButtonSubmit sx={{ width: "200px" }} type='submit'>
          Tạo địa điểm
        </ButtonSubmit>
      </Box>
    </form>
  );
};

export const LocationCreateCDMS = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`${routes.admin.locations.dcms}`);
  };
  const [locationTypes, setLocationTypes] = useState([]);
  const [adsForms, setAdsForms] = useState([]);
  const [isCreateSuccess, setIsCreateSuccess] = useState<boolean | null>(null);
  const intercept = useIntercepts();

  useEffect(() => {
    const getAllLocationTypes = async () => {
      LocationTypeService.getAllLocationTypes({}, intercept)
        .then((res) => {
          setLocationTypes(res.content);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getAllLocationTypes();
  }, []);

  useEffect(() => {
    const getAllAdsForms = async () => {
      AdvertiseFormService.getAllAdvertiseForm({}, intercept)
        .then((res) => {
          setAdsForms(res.content);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getAllAdsForms();
  }, []);

  const handleGetSuccessState = (isSuccess: boolean) => {
    setIsCreateSuccess(isSuccess);
  };

  return (
    <Box>
      {/* <Header /> */}
      <div className={classes["location-edit-container"]}>
        <SideBarDCMS>
          <Box className={classes["container-body"]}>
            <ButtonBack onClick={() => goBack()}>
              <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
              Trở về
            </ButtonBack>

            <Box className={classes["info-edit-container"]}>
              <Heading2>Thông tin điểm đặt quảng cáo</Heading2>
              <MyForm locationTypes={locationTypes} adsForms={adsForms} intercept={intercept} />
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
        </SideBarDCMS>
      </div>
    </Box>
  );
};
