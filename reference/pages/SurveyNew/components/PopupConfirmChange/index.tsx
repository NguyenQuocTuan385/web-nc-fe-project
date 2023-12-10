import { memo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { useTranslation } from 'react-i18next';
import { Help } from '@mui/icons-material';


interface Props {
  isOpen: boolean,
  title: string,
  content: string,
  contentSub: string,
  onCancel: () => void,
  onSubmit: () => void,
}


const PopupConfirmChange = memo((props: Props) => {
  const { isOpen, title, content, contentSub, onCancel, onSubmit } = props;

  const { t } = useTranslation()

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.header}>
        <p className={classes.title}><Help />{title}</p>
        <IconButton onClick={onCancel}>
          <img src={Images.icClose} alt='' />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
        {content}<br /><br />
        <span>{contentSub}</span>
      </DialogContent>
      <DialogActions className={classes.btnBox}>
        <Buttons children={t('common_cancel')} translation-key="common_cancel" btnType="TransparentBlue" padding='11px 16px' onClick={onCancel}/>
        <Buttons children={t('target_confirm_btn_confirm')} translation-key="target_confirm_btn_confirm" btnType='Blue' padding='11px 16px' onClick={onSubmit}/>
      </DialogActions>
    </Dialog>
  );
});
export default PopupConfirmChange;



