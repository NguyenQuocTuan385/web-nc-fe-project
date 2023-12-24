import { useState, useEffect } from "react";

import { Box, Button, IconButton, Typography } from "@mui/material";
import { InfoAdvertise } from "./components/InfoAdvertise";
import { InfoContract } from "./components/InfoContract";
import styled from "styled-components";
import classes from "./styles.module.scss";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sidebar from "../../components/common/Sidebar";
import { Header } from "../../components/common/Header";
import Heading4 from "components/common/text/Heading4";
import AdvertiseService from "services/advertise";
import ContractService from "services/contract";
import advertiseDetailsMock from "./advertise-detail.json";
import { useParams, useNavigate } from "react-router-dom";

const InfoAdsBox = styled(Box)(() => ({
  display: "flex",
  width: "70%"
}));

const BoxFlex = styled(Box)(() => ({
  display: "flex"
  // alignItems: "center"
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
}

interface InfoContract {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
}

export const AdvertiseDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [advertiseDetails, setAdvertiseDetails] = useState(null || advertiseDetailsMock);
  const [infoContractDetails, setInfoContractDetails] = useState(null || advertiseDetailsMock.contracts[0]);
  const [infoAds, setInfoAds] = useState<InfoAds | null>(null);
  const [infoContract, setInfoContract] = useState<InfoContract | null>(null);

  useEffect(() => {
    const getAdvertiseDetails = async () => {
      AdvertiseService.getAdvertiseById(Number(id))
        .then((res) => {
          setAdvertiseDetails(res);
          setInfoAds({
            adsType: res.adsType.name,
            address: res.location.address,
            size: res.width + " x " + advertiseDetails?.height,
            pillarQuantity: res.pillarQuantity,
            adsForm: res.location.adsForm.name,
            locationType: res.location.locationType.name
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getAdvertiseDetails();
  }, []);

  useEffect(() => {
    const getContractByAdvertiseId = async () => {
      ContractService.getContractByAdvertiseId(Number(id))
        .then((res) => {
          setInfoContractDetails(res);
          setInfoContract({
            companyName: res.companyName,
            companyEmail: res.companyEmail,
            companyPhone: res.companyPhone,
            companyAddress: res.companyAddress
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getContractByAdvertiseId();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      <Header />
      <div className={classes["advertise-detail-container"]}>
        <Sidebar></Sidebar>
        <Box className={classes["container-body"]}>
          <ButtonBack onClick={() => goBack()}>
            <IconButtonBack size='medium'>
              <FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>
            </IconButtonBack>
            Trở về
          </ButtonBack>
          <BoxFlex>
            <InfoAdsBox>
              <img src={infoContractDetails.images} alt='Bảng quảng cáo' width={"400px"} height={"250px"} />
              <BoxFlex ml={"15px"}>{infoAds && <InfoAdvertise data={infoAds} />}</BoxFlex>
            </InfoAdsBox>
            <Box>{infoContract && <InfoContract data={infoContract} />}</Box>
          </BoxFlex>

          <Box mt={"15px"}>
            <Heading4>Vị trí trên bản đồ</Heading4>
            <img
              src='https://inuvcuon.vn/images/2018/08/voi-nhung-cong-cu-rat-huu-ich-ban-da-co-the-in-truc-tiep-ngay-tren-google-map.jpg'
              alt='Bản đồ'
              width={"100%"}
              height={"250px"}
            />

            {infoContractDetails && (
              <Box mt={"15px"}>
                <Typography>
                  <span className={classes.title}>Bắt đầu hợp đồng: </span> <span>{infoContractDetails.startAt}</span>
                </Typography>
                <Typography>
                  <span className={classes.title}>Kết thúc hợp đồng: </span> <span>{infoContractDetails.endAt}</span>
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </div>
    </Box>
  );
};
