import React from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import classes from "./styles.module.scss";

interface EditFormProps {
  editedDistrict: string;
  onEditNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ editedDistrict, onEditNameChange, onSubmit, onCancel }) => {
  return (
    <Dialog open={true} onClose={onCancel} className={classes.dialogContainer}>
      <DialogTitle className={classes.dialogTitle}>Chỉnh sửa phường</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField value={editedDistrict} onChange={onEditNameChange} className={classes.formControl} />
        <div className={classes.buttonsContainer}>
          <Button variant='contained' onClick={onSubmit}>
            Lưu
          </Button>
          <Button variant='outlined' onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditForm;
