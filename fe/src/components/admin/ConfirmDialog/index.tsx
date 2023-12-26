import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface AlertDialogProps {
  title: string;
  content: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  confirm: (id: number) => void;
  id: number;
}
export default function AlertDialog(props: AlertDialogProps) {
  const { title, content, open, setOpen, confirm, id } = props;
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    confirm(id);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button onClick={handleConfirm} autoFocus>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
