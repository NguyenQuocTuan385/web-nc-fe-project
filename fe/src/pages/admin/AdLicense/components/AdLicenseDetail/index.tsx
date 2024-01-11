import Box from "@mui/material/Box";
import React from "react";
import classes from "./styles.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading3 from "components/common/text/Heading3";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import SidebarDCMS from "components/admin/SidebarDCMS";
import { Contract, EContractStatus } from "models/contract";
import ContractService from "services/contract";
import { useEffect } from "react";
import AdvertiseService from "services/advertise";
import useIntercepts from "hooks/useIntercepts";

export default function AdLicenseDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const constractId = location.pathname.split("/").pop();
  const [state, setState] = React.useState<Contract | null>(null);
  const intercept = useIntercepts();
  useEffect(() => {
    const getAllContractById = async () => {
      ContractService.getContractById(Number(constractId), intercept).then((res) => {
        setState(res);
      });
    };
    getAllContractById();
  }, [constractId]);
  const startAt = new Date(state?.startAt ?? "").toLocaleDateString("en-GB");

  const endAt = new Date(state?.endAt ?? "").toLocaleDateString("en-GB");

  const updateAdvertisesById = async (row: Contract) => {
    AdvertiseService.updateAdvertiseLicense(
      row.advertise.id,
      {
        licensing: true
      },
      intercept
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateContractById = async (row: Contract) => {
    ContractService.updateContractById(row.id, {
      status: EContractStatus.licensed
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClickAccept = () => {
    if (state) {
      Promise.all([updateAdvertisesById(state), updateContractById(state)]).then(() =>
        navigate(-1)
      );
    }
  };
  const handleClickCancel = () => {
    if (state) {
      updateContractById(state).then(() => navigate(-1));
    }
  };
  return (
    <Box className={classes.boxContainer}>
      <SidebarDCMS>
        <Box className={classes.boxContent}>
          <Box className={classes.backPage} onClick={() => navigate(-1)}>
            <ArrowBackIcon className={classes.iconBack} />
            Trở về
          </Box>
          <Box className={classes.boxContentDetail}>
            <Box className={classes.imageInfoContainer}>
              <Box className={classes.imageContainer}>
                <img src={state?.advertise.images} alt='' className={classes.image} />
              </Box>
              <Box className={classes.infoContainer}>
                <Grid container spacing={2} columns={16}>
                  <Grid item xs={8}>
                    <Box className={classes.infoTable}>
                      <Heading3>Thông tin bảng</Heading3>
                      <ParagraphBody colorName='--gray-60' className={classes.infoContent}>
                        {state?.advertise.adsType.name}
                      </ParagraphBody>
                      <ParagraphBody colorName='--gray-60' className={classes.infoContent}>
                        {state?.advertise.location.address}
                      </ParagraphBody>
                      <ParagraphBody colorName='--gray-60' className={classes.infoContent}>
                        Kích thước:&nbsp;
                        <span>
                          {state?.advertise.width} x {state?.advertise.height}
                        </span>
                      </ParagraphBody>
                      <ParagraphBody colorName='--gray-60' className={classes.infoContent}>
                        Hình thức:&nbsp;
                        <span>{state?.advertise.location.adsForm.name}</span>
                      </ParagraphBody>
                      <ParagraphBody colorName='--gray-60' className={classes.infoContent}>
                        Phân loại:&nbsp;
                        <span>{state?.advertise.location.locationType.name}</span>
                      </ParagraphBody>
                    </Box>
                  </Grid>
                  <Grid item xs={8}>
                    <Box className={classes.infoCompany}>
                      <Heading3>Thông tin công ty</Heading3>
                      <ParagraphBody colorName='--gray-60' className={classes.infoContent}>
                        Tên công ty:&nbsp;
                        <span>{state?.companyName}</span>
                      </ParagraphBody>
                      <ParagraphBody colorName='--gray-60' className={classes.infoContent}>
                        Email:&nbsp;
                        <span>{state?.companyEmail}</span>
                      </ParagraphBody>
                      <ParagraphBody colorName='--gray-60' className={classes.infoContent}>
                        Số điện thoại:&nbsp;
                        <span>{state?.companyPhone}</span>
                      </ParagraphBody>
                      <ParagraphBody colorName='--gray-60' className={classes.infoContent}>
                        Địa chỉ:&nbsp;
                        <span>{state?.companyAddress}</span>
                      </ParagraphBody>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box className={classes.editInfo}>
              <ParagraphBody className={classes.infoContent}>
                Bắt đầu hợp đồng:&nbsp;
                <span>{startAt}</span>
              </ParagraphBody>
              <Box>
                <ParagraphBody className={classes.infoContent}>
                  Kết thúc hợp đồng:&nbsp;
                  <span>{endAt}</span>
                </ParagraphBody>
                <Box></Box>
              </Box>
            </Box>
            <Divider variant='middle' />

            <Box className={classes.boxMapContainer}>
              <Box className={classes.boxTitle}>
                <Heading3>VỊ TRÍ TRÊN BẢN ĐỒ</Heading3>
              </Box>
              <Box className={classes.boxMap}>
                <img
                  src='https://meeymap.com/tin-tuc/wp-content/uploads/2023/06/0-20220914141738669.jpg'
                  alt=''
                  width={"100%"}
                  height={"400px"}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={classes.editHistoryContainer}>
          <Box className={classes.actionButtons}>
            <Button
              onClick={() => handleClickAccept()}
              className={classes.approveButton}
              variant='contained'
              color='primary'
            >
              Duyệt
            </Button>
            <Button
              onClick={() => handleClickCancel()}
              className={classes.skipButton}
              variant='contained'
              color='error'
            >
              Bỏ qua
            </Button>
          </Box>
        </Box>
      </SidebarDCMS>
    </Box>
  );
}
