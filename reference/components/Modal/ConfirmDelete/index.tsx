import { memo } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { useTranslation } from 'react-i18next';



interface ConfirmDeleteProps {
  isOpen: boolean,
  title: string,
  description: string,
  onCancel?: () => void,
  onDelete?: () => void
}


const ConfirmDelete = memo((props: ConfirmDeleteProps) => {
  const { t } = useTranslation()

  const { isOpen, onCancel, onDelete, title, description } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <Grid>
        <Grid className={classes.header}>
          <IconButton onClick={onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
          <Grid className={classes.title}>
            <span>{title}</span>
            <p>{description}</p>
          </Grid>
          <Grid className={classes.btn}>
            <Buttons children={t('common_cancel')} translation-key="common_cancel" btnType='TransparentBlue' padding='11px 16px' onClick={onCancel} />
            <Buttons children={t('common_delete')} translation-key="common_delete" btnType='Red' padding='11px 16px' onClick={onDelete} />
          </Grid>
      </Grid>
    </Dialog>
  );
});
export default ConfirmDelete;



