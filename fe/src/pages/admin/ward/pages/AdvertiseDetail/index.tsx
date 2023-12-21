import { Box, Button, IconButton, Typography } from "@mui/material";
import advertiseDetail from "./advertise-detail.json";
import { InfoAdvertise } from "./components/InfoAdvertise";
import { InfoContract } from "./components/InfoContract";
import styled from "styled-components";
import classes from "./styles.module.scss";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sidebar from "../../components/common/Sidebar";
import { Header } from "../../components/common/Header";
import Heading4 from "components/common/text/Heading4";

const InfoAdsBox = styled(Box)(() => ({
  display: "flex",
  width: "70%",
}));

const BoxFlex = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

export const AdvertiseDetail = () => {
  const infoAds = {
    adsType: advertiseDetail.adsType.name,
    address: advertiseDetail.location.address,
    size: advertiseDetail.width + " x " + advertiseDetail.height,
    quantity: 1,
    adsForm: advertiseDetail.location.adsForm.name,
    locationType: advertiseDetail.location.locationType.name,
  };

  const infoContract = advertiseDetail.contracts[0];

  return (
    <Box>
      <Header />
      <div className={classes["advertise-detail-container"]}>
        <Sidebar></Sidebar>
        <Box className={classes["container-body"]}>
          <Button>
            <IconButton size="medium">
              <FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>
            </IconButton>
            Trở về
          </Button>
          <BoxFlex>
            <InfoAdsBox>
              <img
                src={
                  infoContract?.imgUrl ||
                  "https://bienhieudep.vn/wp-content/uploads/2021/08/bien-quang-cao-tam-lon-6.jpg"
                }
                alt="Bảng quảng cáo"
                width={"400px"}
                height={"250px"}
              />
              <BoxFlex ml={"15px"}>
                <InfoAdvertise data={infoAds} />
              </BoxFlex>
            </InfoAdsBox>
            <Box>
              <InfoContract data={infoContract} />
            </Box>
          </BoxFlex>

          <Box mt={"15px"}>
            <Heading4>Vị trí trên bản đồ</Heading4>
            <img
              src="https://inuvcuon.vn/images/2018/08/voi-nhung-cong-cu-rat-huu-ich-ban-da-co-the-in-truc-tiep-ngay-tren-google-map.jpg"
              alt="Bản đồ"
              width={"100%"}
              height={"250px"}
            />

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
          </Box>
        </Box>
      </div>
    </Box>
  );
};
