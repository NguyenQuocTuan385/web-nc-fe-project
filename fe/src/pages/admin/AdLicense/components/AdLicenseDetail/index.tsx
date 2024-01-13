import Box from "@mui/material/Box";
import React from "react";
import classes from "./styles.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function AdLicenseDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const constractId = location.pathname.split("/").pop();
  const [state, setState] = React.useState<Contract | null>(null);
  const intercept = useIntercepts();
  const [openAccept, setOpenAccept] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);
  const handleClose = () => {
    setOpenAccept(false);
    setOpenCancel(false);
  };
  useEffect(() => {
    const getContractById = async () => {
      ContractService.getContractById(Number(constractId), intercept).then((res) => {
        setState(res);
      });
    };
    getContractById();
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
  const confirmAccept = async () => {
    await updateAdvertisesById(state!!);
    await updateContractById(state!!);
    navigate(-1);
  };
  const handleClickAccept = () => {
    setOpenAccept(true);
  };
  const confirmCancel = async () => {
    await updateContractById(state!!);
    navigate(-1);
  };
  const handleClickCancel = () => {
    setOpenCancel(true);
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
      <Dialog
        open={openAccept}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Cấp phép quảng cáo</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn muốn cấp phép quảng cáo này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={confirmAccept} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCancel}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Hủy cấp phép quảng cáo</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn muốn hủy cấp phép quảng cáo này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={confirmCancel} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
