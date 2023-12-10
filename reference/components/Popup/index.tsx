import React, { memo } from 'react';
import { Dialog, DialogProps, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';
import Images from "config/images";

interface PopupProps extends DialogProps {
  title: string,
  description?: string,
  children: React.ReactNode,
  onClose: () => void,
  minHeight?: number | string
}


const Popup = memo((props: PopupProps) => {
  const { title, description, children, onClose, minHeight, ...res } = props;

  return (
    <Dialog
      maxWidth="md"
      classes={{ paper: classes.paper }}
      {...res}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>{title}</p>
          <IconButton onClick={onClose}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body} sx={{ minHeight: minHeight }}>
          { description && <p>{description}</p> }
          {children}
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default Popup;



