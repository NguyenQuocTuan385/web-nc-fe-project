import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from "@mui/material";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useParams } from "react-router-dom";

import { Header } from "components/common/Header";
import classes from "./styles.module.scss";
import SideBarWard from "components/admin/SidebarWard";
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
import userDetails from "userDetails.json";
import DistrictService from "services/district";
import { Property } from "models/property";
import WardService from "services/ward";

interface FormData {
  districtId: number;
  propertyId: number;
  address: string;
  locationTypeId: number;
  advertiseFormId: number;
  planning: number;
  imageUrls: any[];
  latitude: number;
  longitude: number;
}

const schema: any = Yup.object().shape({
  districtId: Yup.number().required("Quận là trường bắt buộc"),
  propertyId: Yup.number().required("Phường là trường bắt buộc"),
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

interface FormCreateLocationDCMSProps {
  district: Property[];
  locationTypes: LocationType[];
  adsForms: AdvertiseForm[];
  createLocationByCDMSRequest: (isSuccess: boolean) => void;
  locationId: number;
}

const MyForm: React.FC<FormCreateLocationDCMSProps> = ({
  district,
  locationTypes,
  adsForms,
  createLocationByCDMSRequest,
  locationId
}: any) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    register
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  // Khi có login thì lấy thông tin từ login
  const userInfo = { ...userDetails };

  const [openDialog, setOpenDialog] = useState(false);
  const [originalImages, setOriginalImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState<Array<any>>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<Number>();
  const [isWardDropdownDisabled, setIsWardDropdownDisabled] = useState(true);
  const [wards, setWards] = useState<any>([]);
  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEmitSuccessState = (isSuccess: boolean) => {
    createLocationByCDMSRequest(isSuccess);
  };

  const getWard = async () => {
    console.log(selectedDistrict);
    WardService.getAllWardBy(Number(selectedDistrict), {
      search: "",
      current: 1,
      pageSize: 999
    })
      .then((res) => {
        setWards(res.content);
        setIsWardDropdownDisabled(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const createLocationByCDMS = async (locationCreateRequest: LocationCreateRequest) => {
    console.log(locationCreateRequest);
    LocationService.createLocation(locationCreateRequest)
      .then((res) => {
        handleEmitSuccessState(true);
        navigate(-1);
      })
      .catch((err) => {
        handleEmitSuccessState(false);
        console.log(err);
      });
  };

  const submitHandler = async (data: any) => {
    console.log("hehehehehehehe1");
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
      // lay data tu form nhung bỏ districtId
      ...formSubmit,
      image: savedImageUrls.length > 0 ? savedImageUrls : formSubmit.imageUrls[0]
    };
    console.log(dataSubmit);
    createLocationByCDMS(dataSubmit);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {/* Quận huyện */}
      <div className={classes["input-container"]}>
        <label>Địa điểm:</label>
        <Box className={classes["coordinates-container"]}>
          <Box className={classes["input-small"]}>
            <label>Quận: </label>
            <Controller
              control={control}
              name='districtId'
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setSelectedDistrict(Number(e.target.value));
                      setIsWardDropdownDisabled(true);
                      getWard();
                      console.log(e.target.value);
                    }}
                    className={classes["select-custom"]}
                  >
                    <option value=''>Chọn quận</option>
                    {district.length > 0 &&
                      district.map((district: Property, index: number) => {
                        return (
                          <option value={district.id} key={district.id}>
                            {district.name}
                          </option>
                        );
                      })}
                  </select>
                  {errors.districtId && <div className={classes["error-text"]}></div>}
                </div>
              )}
            />
          </Box>

          <Box className={classes["input-small"]}>
            <label>Phường: </label>
            <Controller
              control={control}
              name='propertyId'
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <select
                    {...field}
                    disabled={isWardDropdownDisabled}
                    className={classes["select-custom"]}
                  >
                    <option value=''>Chọn phường</option>
                    {wards.length > 0 &&
                      wards.map((ward: Property, index: number) => {
                        return (
                          <option value={ward.id} key={ward.id}>
                            {ward.name}
                          </option>
                        );
                      })}
                  </select>
                  {errors.propertyId && <div className={classes["error-text"]}></div>}
                </div>
              )}
            />
          </Box>
        </Box>
      </div>

      {/* Địa chỉ */}
      <div className={classes["input-container"]}>
        <label>Địa chỉ:</label>
        <Controller
          control={control}
          name='address'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <input
                {...field}
                {...register("address")}
                type='text'
                className={classes["input-custom"]}
              />
              {errors.address && <div className={classes["error-text"]}></div>}
            </div>
          )}
        />
      </div>

      {/* Tọa độ */}
      <div className={classes["input-container"]}>
        <label>Tọa độ:</label>
        <Box className={classes["coordinates-container"]}>
          <Box className={classes["input-small"]}>
            <label>Vĩ độ: </label>
            <Controller
              control={control}
              name='latitude'
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <input
                    {...field}
                    {...register("latitude")}
                    type='number'
                    className={classes["input-custom"]}
                  />
                </div>
              )}
            />
          </Box>

          <Box className={classes["input-small"]}>
            <label>Tung độ: </label>
            <Controller
              control={control}
              name='longitude'
              render={({ field }) => (
                <div className={classes["input-error-container"]}>
                  <input
                    {...field}
                    {...register("longitude")}
                    type='number'
                    className={classes["input-custom"]}
                  />
                </div>
              )}
            />
          </Box>
        </Box>
      </div>

      {/* Loại vị trí */}
      <div className={classes["input-container"]}>
        <label>Loại vị trí:</label>
        <Controller
          control={control}
          name='locationTypeId'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <select
                {...field}
                {...register("locationTypeId")}
                className={classes["select-custom"]}
              >
                <option value=''>Chọn loại vị trí</option>
                {locationTypes.length > 0 &&
                  locationTypes.map((locationType: LocationType, index: number) => {
                    return (
                      <option value={locationType.id} key={locationType.id}>
                        {locationType.name}
                      </option>
                    );
                  })}
              </select>
              {errors.locationTypeId && <div className={classes["error-text"]}></div>}
            </div>
          )}
        />
      </div>

      {/* Hình thức quảng cáo */}
      <div className={classes["input-container"]}>
        <label>Hình thức quảng cáo:</label>
        <Controller
          control={control}
          name='advertiseFormId'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <select
                {...field}
                {...register("advertiseFormId")}
                className={classes["select-custom"]}
              >
                <option value=''>Chọn hình thức quảng cáo</option>
                {adsForms.length > 0 &&
                  adsForms.map((adsForm: AdvertiseForm, index: number) => {
                    return (
                      <option value={adsForm.id} key={adsForm.id}>
                        {adsForm.name}
                      </option>
                    );
                  })}
              </select>
              {errors.advertiseFormId && <div className={classes["error-text"]}></div>}
            </div>
          )}
        />
      </div>

      {/* Quy hoạch */}
      <div className={classes["input-container"]}>
        <label>Quy hoạch:</label>
        <Controller
          control={control}
          name='planning'
          render={({ field }) => (
            <div className={classes["input-error-container"]}>
              <select {...field} {...register("planning")} className={classes["select-custom"]}>
                <option value=''>Chọn quy hoạch</option>
                <option value='false'>Chưa quy hoạch</option>
                <option value='true'>Đã quy hoạch</option>
              </select>
            </div>
          )}
        />
      </div>

      {/* Hình ảnh */}
      <div className={classes["input-container"]}>
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
                        alt='Image Loation'
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
      </div>

      <ButtonSubmit type='submit'>Tạo</ButtonSubmit>
    </form>
  );
};

export const LocationCreateCDMS = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const goBack = () => {
    navigate(`${routes.admin.locations.dcms.replace(":id", `${id}`)}`);
  };

  const [district, setDistrict] = useState<any>([]);
  const [locationTypes, setLocationTypes] = useState([]);
  const [adsForms, setAdsForms] = useState([]);
  const [isCreateSuccess, setIsCreateSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const getDistrict = async () => {
      DistrictService.getAllDistrict({})
        .then((res) => {
          setDistrict(res.content);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getDistrict();
  }, []);

  useEffect(() => {
    const getAllLocationTypes = async () => {
      LocationTypeService.getAllLocationTypes({})
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
      AdvertiseFormService.getAllAdvertiseForm({})
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
      <Header />
      <div className={classes["location-edit-container"]}>
        <SideBarWard></SideBarWard>
        <Box className={classes["container-body"]}>
          <ButtonBack onClick={() => goBack()}>
            <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
            Trở về
          </ButtonBack>

          <Box className={classes["info-edit-container"]}>
            <h2>Thông tin điểm đặt quảng cáo</h2>
            <MyForm
              district={district}
              locationTypes={locationTypes}
              adsForms={adsForms}
              createLocationByCDMSRequest={handleGetSuccessState}
              locationId={Number(id)}
            />
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
