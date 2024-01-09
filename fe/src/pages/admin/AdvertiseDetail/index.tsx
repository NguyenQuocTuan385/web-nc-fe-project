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
  startAt: string;
  endAt: string;
}

export const AdvertiseDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [infoAds, setInfoAds] = useState<InfoAds | null>(null);
  const [infoContract, setInfoContract] = useState<InfoContract | null>(null);

  useEffect(() => {
    const getAdvertiseDetails = async () => {
      AdvertiseService.getAdvertiseById(Number(id))
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
        });
    };
    getAdvertiseDetails();
  }, []);

  useEffect(() => {
    const getContractByAdvertiseId = async () => {
      ContractService.getContractsByAdvertiseOne(Number(id), {})
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
        <SideBarWard></SideBarWard>
        <Box className={classes["container-body"]}>
          <ButtonBack onClick={() => goBack()}>
            <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: "5px" }} />
            Trở về
          </ButtonBack>
          <BoxFlex>
            {infoAds && (
              <img src={infoAds.images} alt='Bảng quảng cáo' width={"50%"} height={"250px"} />
            )}
            <Box width={"50%"} ml={"15px"}>
              {infoAds && <InfoAdvertise data={infoAds} />}
            </Box>
          </BoxFlex>

          <BoxFlex sx={{ justifyContent: "flex-end", marginTop: "24px" }}>
            <Box width={"50%"}>
              {infoContract && infoContract && <InfoContract data={infoContract} />}
            </Box>
            {infoContract && (
              <img
                src={infoContract.images}
                alt='Hình ảnh công ty'
                width={"50%"}
                height={"250px"}
              />
            )}
          </BoxFlex>

          <Box mt={"15px"}>
            <Heading4 fontWeight={600} fontSize={"18px"}>
              Vị trí trên bản đồ
            </Heading4>
            <img
              src='https://inuvcuon.vn/images/2018/08/voi-nhung-cong-cu-rat-huu-ich-ban-da-co-the-in-truc-tiep-ngay-tren-google-map.jpg'
              alt='Bản đồ'
              width={"100%"}
              height={"250px"}
            />

            {infoContract && (
              <Box mt={"15px"}>
                <Typography>
                  <span className={classes.title}>Bắt đầu hợp đồng: </span>{" "}
                  <span>{infoContract.startAt}</span>
                </Typography>
                <Typography>
                  <span className={classes.title}>Kết thúc hợp đồng: </span>{" "}
                  <span>{infoContract.endAt}</span>
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </div>
    </Box>
  );
};
