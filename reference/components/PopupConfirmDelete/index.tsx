import { memo } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import Button, {BtnType} from "components/common/buttons/Button";

interface Props {
  isOpen: boolean,
  title: string,
  description: string,
  onCancel: () => void,
  onDelete: () => void,
}


const PopupConfirmDelete = memo((props: Props) => {
  const { onCancel, isOpen, title, description, onDelete } = props;
  const { t } = useTranslation()


  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <Grid>
        <Grid className={classes.header}>
          <Grid sx={{display: 'flex', alignItems: 'center'}}>
            <CloseIcon className={classes.closeIconTitle}/>
            <Heading3 $colorName="--cimigo-blue-dark-3">{title}</Heading3>
          </Grid>
          <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onCancel}/>
        </Grid>
          <Grid className={classes.title}>
            <p>{description}</p>
          </Grid>
          <Grid className={classes.btn}>
            <Button children={t('common_cancel')} translation-key="common_cancel" btnType={BtnType.Secondary} onClick={onCancel} />
            <Buttons children={t('common_delete')} translation-key="common_delete" btnType='Red' padding='8px 16px' onClick={onDelete}/>
          </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupConfirmDelete;



