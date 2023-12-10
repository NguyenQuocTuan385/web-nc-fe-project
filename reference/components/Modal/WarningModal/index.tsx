import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography
} from "@mui/material";
import React from "react";
import { Error as ErrorIcon } from '@mui/icons-material';
import classes from "./styles.module.scss"


interface WarningModalProps {
  isOpen: boolean
  title: string,
  onClose: () => void
  onYes: () => void
}

const WarningModal = ({ title, isOpen, onClose, onYes, children }: React.PropsWithChildren<WarningModalProps>) => {

  const handleClose = () => {
    onClose();
  }
  const handleYes = () => {
    onYes();
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        fullWidth
        onClose={handleClose}
        aria-labelledby="alert-dialog-warning"
        aria-describedby="alert-dialog-warning-confirm"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px 24px' }}>
          <ErrorIcon className={classes.icon} />
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
        </Box>
        <DialogContent>
          <DialogContentText sx={{color: '#000'}}>
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className={classes.buttonCancel} onClick={handleClose}>
            Cancel
          </Button>
          <Button className={classes.buttonConfirm} onClick={handleYes} variant="contained" autoFocus>
            Yes
          </Button>
        </DialogActions>
       
      </Dialog>
    </div>
  )
}

export default WarningModal;