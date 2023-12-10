import { memo } from 'react';
import { Dialog, Grid } from '@mui/material';
import classes from './styles.module.scss';
import Buttons from 'components/Buttons';
import Heading2 from "components/common/text/Heading2";
import ButtonClose from "components/common/buttons/ButtonClose";
import Button, {BtnType} from "components/common/buttons/Button";
import ParagraphBody from 'components/common/text/ParagraphBody';

interface Props {
  isOpen: boolean,
  title: string,
  description: string,
  cancelText: string,
  deleteText: string,
  onCancel: () => void,
  onDelete: () => void,
}

const PopupConfirmDeleteCommon = memo((props: Props) => {
  const { title, description, cancelText, deleteText, onCancel, isOpen, onDelete } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <Grid>
        <Grid sx={{textAlign: 'end'}}>
          <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onCancel}/>
        </Grid>
        <Grid sx={{textAlign: 'center'}}>
          <Heading2 $colorName="--cimigo-theme-light-on-surface" className={classes.title}>{title}</Heading2>
        </Grid>
        <Grid sx={{textAlign: 'center'}} mt={2} mb={4}>
          <ParagraphBody $colorName="--cimigo-theme-light-on-surface">{description}</ParagraphBody>
        </Grid>
        <Grid className={classes.btn}>
          <Button children={cancelText} btnType={BtnType.Secondary} onClick={onCancel} />
          <Buttons children={deleteText} btnType='Red' padding='8px 16px' onClick={onDelete}/>
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupConfirmDeleteCommon;
