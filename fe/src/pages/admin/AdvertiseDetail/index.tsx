import { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import styled from "styled-components";
import classes from "./styles.module.scss";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useNavigate } from "react-router-dom";

import { InfoAdvertise } from "./components/InfoAdvertise";
import { InfoContract } from "./components/InfoContract";
import SideBarWard from "components/admin/SidebarWard";
import { Header } from "components/common/Header";
import AdvertiseService from "services/advertise";
import ContractService from "services/contract";
import Heading4 from "components/common/text/Heading4";
import useIntercepts from "hooks/useIntercepts";
import { DateHelper } from "helpers/date";
import SideBarDCMS from "components/admin/SidebarDCMS";
import { User } from "models/user";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { ERole } from "models/general";
import Heading3 from "components/common/text/Heading3";
import { loading } from "reduxes/Loading";

const InfoAdsBox = styled(Box)(() => ({
  display: "flex",
  width: "70%"
}));

const BoxFlex = styled(Box)(() => ({
  display: "flex",
  alignItems: "center"
}));

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

interface InfoAds {
  adsType: string;
  address: string;
  size: string;
  pillarQuantity: number;
  adsForm: string;
  locationType: string;
  images: string;
}

interface InfoContract {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  images: string;
  startAt: Date;
  endAt: Date;
}

export const AdvertiseDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [infoAds, setInfoAds] = useState<InfoAds | null>(null);
  const [infoContract, setInfoContract] = useState<InfoContract | null>(null);
  const intercept = useIntercepts();
  const dispatch = useDispatch();
  useEffect(() => {
    const getAdvertiseDetails = async () => {
      dispatch(loading(true));
      AdvertiseService.getAdvertisesById(Number(id), intercept)
        .then((res) => {
          setInfoAds({
            adsType: res.adsType.name,
            address: res.location.address,
            size: res.width + " x " + res.height,
            pillarQuantity: res.pillarQuantity,
            adsForm: res.location.adsForm.name,
            locationType: res.location.locationType.name,
            images: res.images
          });
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => dispatch(loading(false)));
    };
    getAdvertiseDetails();
  }, []);

  useEffect(() => {
    const getContractByAdvertiseId = async () => {
      dispatch(loading(true));
      ContractService.findContractLicensingByAdvertiseId(Number(id), {}, intercept)
        .then((res) => {
          setInfoContract({
            companyName: res.companyName,
            companyEmail: res.companyEmail,
            companyPhone: res.companyPhone,
            companyAddress: res.companyAddress,
            images: res.images,
            startAt: res.startAt,
            endAt: res.endAt
          });
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => dispatch(loading(false)));
    };
    getContractByAdvertiseId();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const currentUser: User = useSelector(selectCurrentUser);

  return (
    <Box>
      {/* <Header /> */}
      <div className={classes["advertise-detail-container"]}>
        {currentUser.role.id === ERole.WARD || currentUser.role.id === ERole.DISTRICT ? (
          <SideBarWard>
            <Box className={classes["container-body"]}>
              <ButtonBack onClick={() => goBack()}>
                <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
                Trở về
              </ButtonBack>
              {infoAds && !infoContract && (
                <Box className={classes.boxAdsInfo}>
                  <Heading3>Thông tin bảng quảng cáo</Heading3>
                  <Box className={classes.boxImg}>
                    <img src={infoAds.images} className={classes.imageLarge} alt='Bảng quảng cáo' />
                  </Box>

                  <Box
                    width={"100%"}
                    sx={{
                      display: "flex",
                      gap: "10px"
                    }}
                  >
                    {infoAds && <InfoAdvertise data={infoAds} />}
                  </Box>
                </Box>
              )}

              {infoAds && infoContract && (
                <BoxFlex>
                  <img
                    src={infoAds.images}
                    className={classes.image}
                    alt='Bảng quảng cáo'
                    width={"50%"}
                    height={"250px"}
                  />
                  <Box
                    width={"50%"}
                    ml={"15px"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      height: "350px",
                      alignItems: "center",
                      padding: "15px"
                    }}
                  >
                    {infoAds && <InfoAdvertise data={infoAds} title={true} />}
                  </Box>
                </BoxFlex>
              )}

              {infoContract && (
                <BoxFlex
                  sx={{
                    justifyContent: "flex-end",
                    marginTop: "24px"
                  }}
                >
                  <img
                    className={`${classes.image} ${classes.smallImage}`}
                    src={infoContract.images}
                    alt='Hình ảnh công ty'
                    width={"50%"}
                    height={"250px"}
                  />
                  <Box
                    width={"50%"}
                    ml={"15px"}
                    sx={{
                      display: "flex",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      height: "350px",
                      alignItems: "center",
                      padding: "15px"
                    }}
                  >
                    {infoContract && infoContract && <InfoContract data={infoContract} />}
                    <Box mt={"15px"}>
                      <Typography>
                        <span className={classes.title}>Bắt đầu hợp đồng: </span>{" "}
                        <span>{DateHelper.formatDateToDDMMYYYY(infoContract.startAt)}</span>
                      </Typography>
                      <Typography>
                        <span className={classes.title}>Kết thúc hợp đồng: </span>{" "}
                        <span>{DateHelper.formatDateToDDMMYYYY(infoContract.endAt)}</span>
                      </Typography>
                    </Box>
                  </Box>
                </BoxFlex>
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
              {infoAds && (
                <BoxFlex>
                  <img
                    src={infoAds.images}
                    className={classes.image}
                    alt='Bảng quảng cáo'
                    width={"50%"}
                    height={"250px"}
                  />
                  <Box
                    width={"50%"}
                    ml={"15px"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      height: "350px",
                      alignItems: "center",
                      padding: "15px"
                    }}
                  >
                    {infoAds && <InfoAdvertise data={infoAds} />}
                  </Box>
                </BoxFlex>
              )}

              {infoContract && (
                <BoxFlex
                  sx={{
                    justifyContent: "flex-end",
                    marginTop: "24px"
                  }}
                >
                  <img
                    className={`${classes.image} ${classes.smallImage}`}
                    src={infoContract.images}
                    alt='Hình ảnh công ty'
                    width={"50%"}
                    height={"250px"}
                  />
                  <Box
                    width={"50%"}
                    ml={"15px"}
                    sx={{
                      display: "flex",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      height: "350px",
                      alignItems: "center",
                      padding: "15px"
                    }}
                  >
                    {infoContract && infoContract && <InfoContract data={infoContract} />}
                  </Box>
                </BoxFlex>
              )}

              <Box mt={"15px"}>
                {infoContract && (
                  <Box mt={"15px"}>
                    <Typography>
                      <span className={classes.title}>Bắt đầu hợp đồng: </span>{" "}
                      <span>{DateHelper.formatDateToDDMMYYYY(infoContract.startAt)}</span>
                    </Typography>
                    <Typography>
                      <span className={classes.title}>Kết thúc hợp đồng: </span>{" "}
                      <span>{DateHelper.formatDateToDDMMYYYY(infoContract.endAt)}</span>
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </SideBarDCMS>
        )}
      </div>
    </Box>
  );
};
