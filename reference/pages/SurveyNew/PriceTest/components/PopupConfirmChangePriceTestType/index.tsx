import {
  Dialog,
  IconButton,
} from '@mui/material';
import Buttons from 'components/Buttons';
import classes from './styles.module.scss';
import Images from 'config/images';
import { Help } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Heading3 from 'components/common/text/Heading3';
import ParagraphBody from 'components/common/text/ParagraphBody';
import { DialogActionsConfirm } from 'components/common/dialogs/DialogActions';
import { DialogContentConfirm } from 'components/common/dialogs/DialogContent';
import { DialogTitleConfirm } from 'components/common/dialogs/DialogTitle';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onYes: () => void;
  typeTitle: string;
}

const PopupConfirmChangePriceTestType = (props: Props) => {
  const { typeTitle, onCancel, isOpen, onYes } = props;
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onClose={onCancel} classes={{ paper: classes.paper }}>
      <DialogTitleConfirm>
        <Help className={classes.infoIcon}/>
        <Heading3
          translation-key="setup_survey_popup_confirm_change_price_test_type_title"
          $colorName='--cimigo-blue-dark-3'
          dangerouslySetInnerHTML={{
            __html: t(
              'setup_survey_popup_confirm_change_price_test_type_title',
              { type: typeTitle }
            ),
          }}
        />
        <IconButton className={classes.closeBtn} onClick={onCancel}>
          <img src={Images.icClose} alt="" />
        </IconButton>
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody
          className={classes.content}
          translation-key="setup_survey_popup_confirm_change_price_test_type_content"
          $colorName="--gray-90"
          dangerouslySetInnerHTML={{
            __html: t(
              'setup_survey_popup_confirm_change_price_test_type_content',
              { type: typeTitle }
            ),
          }}
        />
        <ParagraphBody
          sx={{ mt: 3 }}
          className={classes.content}
          translation-key="setup_survey_popup_confirm_change_price_test_type_confirm"
          $colorName="--gray-90"
          dangerouslySetInnerHTML={{
            __html: t(
              'setup_survey_popup_confirm_change_price_test_type_confirm',
              { type: typeTitle }
            ),
          }}
        />
      </DialogContentConfirm>
      <DialogActionsConfirm>
        <Buttons
          className={classes.cancelBtn}
          translation-key="common_cancel"
          children={t('common_cancel')}
          btnType="Blue"
          padding="11px 16px"
          onClick={onCancel}
        />
        <Buttons
          translation-key="common_ok"
          children={t('common_ok')}
          btnType="Blue"
          padding="11px 16px"
          onClick={onYes}
        />
      </DialogActionsConfirm>
    </Dialog>
  );
};
export default PopupConfirmChangePriceTestType;
