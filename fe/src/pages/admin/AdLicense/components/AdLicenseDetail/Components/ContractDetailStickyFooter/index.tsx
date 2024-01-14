import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";

import classes from "./styles.module.scss";
import ContractService from "services/contract";
import { Contract, EContractStatus } from "models/contract";
import Heading6 from "components/common/text/Heading6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircleXmark, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import useIntercepts from "hooks/useIntercepts";
import AdvertiseService from "services/advertise";
import { set } from "react-hook-form";

interface PropsData {
  startDate?: Date;
  endDate?: Date;
  status?: number;
  contract: Contract;
}

function ContractDetailStickyFooter({ startDate, endDate, status, contract }: PropsData) {
  const navigate = useNavigate();
  const [openAcceptDialog, setopenAcceptDialog] = useState(false);
  const [openCancelDialog, setopenCancelDialog] = useState(false);
  const intercept = useIntercepts();

  const openAcceptDialogHandle = () => {
    setopenAcceptDialog(true);
  };

  const closeAcceptDialogHandle = () => {
    setopenAcceptDialog(false);
  };

  const openCancelDialogHandle = () => {
    setopenCancelDialog(true);
  };

  const closeCancelDialogHandle = () => {
    setopenCancelDialog(false);
  };

  const deleteContractHandle = (id: number) => {
    ContractService.deleteContracts(id, intercept)
      .then((res) => {})
      .catch((e) => {
        console.log(e);
      });
    setopenAcceptDialog(false);
    navigate(-1);
  };

  const updateAdvertisesById = async () => {
    AdvertiseService.updateAdvertiseLicense(
      contract.advertise.id,
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
  const updateContractById = async () => {
    ContractService.updateContractById(
      contract.id,
      {
        status: EContractStatus.licensed
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

  const confirmAccept = async () => {
    await updateAdvertisesById();
    await updateContractById();
    setopenAcceptDialog(false);
    navigate(-1);
  };
  const confirmCancel = async () => {
    await deleteContractHandle(contract.id);
    setopenCancelDialog(false);
    navigate(-1);
  };
  const backHandle = () => {
    navigate(-1);
  };
  return (
    <Box>
      <div className={classes.stickyFooterContainer}>
        <div className={classes.phantom} />
        <div className={classes.stickyFooterItem}>
          {status === EContractStatus.notLicensed ? (
            <Box className={classes.footerItem}>
              <Box>
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  style={{ color: "var(--red-error)" }}
                  size='lg'
                  className={classes.itemIcon}
                />
                <Heading6 colorName='--red-error'>Chưa được cấp phép</Heading6>
              </Box>
              <Box>
                <Button
                  variant='contained'
                  className={classes.backButton}
                  color='error'
                  onClick={openCancelDialogHandle}
                >
                  Từ chối
                </Button>
                <Button
                  variant='contained'
                  className={classes.cancelButton}
                  color='primary'
                  onClick={openAcceptDialogHandle}
                >
                  Duyệt
                </Button>
              </Box>
            </Box>
          ) : status === EContractStatus.licensed ? (
            <Box className={classes.footerItem}>
              <Box>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: "var(--green-600)" }}
                  size='lg'
                  className={classes.itemIcon}
                />
                <Heading6 colorName='--green-600'>Đã được cấp phép</Heading6>
              </Box>

              <Box className={classes.backContainer}>
                <Box>
                  <Button
                    variant='contained'
                    className={classes.backButton}
                    color='secondary'
                    onClick={backHandle}
                  >
                    Trở về
                  </Button>
                </Box>
                <Box>
                  <Heading6>Bắt đầu hợp đồng: {startDate?.toString()}</Heading6>
                  <Heading6>Bắt đầu hợp đồng: {endDate?.toString()}</Heading6>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box className={classes.footerItem}>
              <Box>
                <FontAwesomeIcon
                  icon={faWarning}
                  style={{ color: "var(--gray-60)" }}
                  size='lg'
                  className={classes.itemIcon}
                />
                <Heading6 colorName='--gray-60'>Đã hết hạn</Heading6>
              </Box>
              <Box className={classes.backContainer}>
                <Button
                  variant='contained'
                  className={classes.backButton}
                  color='secondary'
                  onClick={backHandle}
                >
                  Trở về
                </Button>
                <Box>
                  <Heading6>Bắt đầu hợp đồng: {startDate?.toString()}</Heading6>
                  <Heading6>Bắt đầu hợp đồng: {endDate?.toString()}</Heading6>
                </Box>
              </Box>
            </Box>
          )}
        </div>
      </div>

      <Dialog
        open={openAcceptDialog}
        onClose={closeAcceptDialogHandle}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Lưu ý"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn có thật sự muốn cấp phép quảng cáo này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='error' onClick={closeAcceptDialogHandle}>
            Hủy bỏ
          </Button>
          <Button variant='contained' onClick={confirmAccept} autoFocus color='success'>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCancelDialog}
        onClose={closeAcceptDialogHandle}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Lưu ý"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn có thật sự muốn từ chối cấp phép quảng cáo này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='error' onClick={closeCancelDialogHandle}>
            Hủy bỏ
          </Button>
          <Button variant='contained' onClick={confirmCancel} autoFocus color='success'>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ContractDetailStickyFooter;
