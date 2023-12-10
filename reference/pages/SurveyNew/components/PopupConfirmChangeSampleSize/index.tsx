import { Box, Dialog } from '@mui/material';
import classes from "./styles.module.scss";
import { useTranslation } from 'react-i18next';
import { DialogTitleConfirm } from 'components/common/dialogs/DialogTitle';
import Heading3 from 'components/common/text/Heading3';
import ButtonClose from 'components/common/buttons/ButtonClose';
import { DialogContentConfirm } from 'components/common/dialogs/DialogContent';
import { DialogActionsConfirm } from 'components/common/dialogs/DialogActions';
import Button, { BtnType } from 'components/common/buttons/Button';
import TextBtnSmall from 'components/common/text/TextBtnSmall';
import { Help } from '@mui/icons-material';
import ParagraphBody from 'components/common/text/ParagraphBody';
import { useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import { ESOLUTION_TYPE } from 'models';

export interface DataConfirmChangeSampleSize {
  isConfirmQuotas?: boolean,
  isConfirmEyeTrackingSampleSize?: boolean,
  newSampleSize?: number,
  oldEyeTrackingSampleSize?: number,
  newEyeTrackingSampleSize?: number,
}

interface Props {
  data: DataConfirmChangeSampleSize,
  onClose: () => void
  onConfirm: () => void,
}

const PopupConfirmChangeSampleSize = ({ data, onClose, onConfirm }: Props) => {

  const { t } = useTranslation()

  const { project } = useSelector((state: ReducerType) => state.project)


  const renderConfirmEyeTracking = () => {
    switch (project?.solution?.typeId) {
      case ESOLUTION_TYPE.PACK:
        return (
          <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'
            translation-key="target_popup_change_sample_size_your_adjusted_eye_tracking"
            dangerouslySetInnerHTML={{
              __html: t("target_popup_change_sample_size_your_adjusted_eye_tracking", { oldEyeTrackingSampleSize: data?.oldEyeTrackingSampleSize, newEyeTrackingSampleSize: data?.newEyeTrackingSampleSize }),
            }}
          >
          </ParagraphBody>
        )
      case ESOLUTION_TYPE.VIDEO_CHOICE:
        return (
          <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'
            translation-key="target_popup_change_sample_size_your_adjusted_eye_tracking_video"
            dangerouslySetInnerHTML={{
              __html: t("target_popup_change_sample_size_your_adjusted_eye_tracking_video", { old: data?.oldEyeTrackingSampleSize, new: data?.newEyeTrackingSampleSize }),
            }}
          >
          </ParagraphBody>
        )
    }
  }

  return (
    <Dialog
      scroll="paper"
      open={!!data}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitleConfirm>
        <Box display="flex">
          <Help sx={{ fontSize: 32, color: "var(--warning)", mr: 2 }} />
          <Heading3 $colorName='--cimigo-blue-dark-3' translation-key="target_popup_change_sample_size_title">{t("target_popup_change_sample_size_title")}</Heading3>
        </Box>
        <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onClose} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody $colorName='--gray-80' translation-key="target_popup_change_sample_size_sub_title">{t("target_popup_change_sample_size_sub_title")}</ParagraphBody>
        <ul className={classes.list}>
          {data?.isConfirmQuotas && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'
              translation-key="target_popup_change_sample_size_your_adjusted_quota"
              dangerouslySetInnerHTML={{
                __html: t("target_popup_change_sample_size_your_adjusted_quota"),
              }}
            >
            </ParagraphBody>
          )}
          {data?.isConfirmEyeTrackingSampleSize && renderConfirmEyeTracking()}
        </ul>
        <ParagraphBody mt={4} $colorName='--gray-80' translation-key="target_popup_change_sample_size_do_you_want_question">{t("target_popup_change_sample_size_do_you_want_question")}</ParagraphBody>
      </DialogContentConfirm>
      <DialogActionsConfirm className={classes.btn}>
        <Button btnType={BtnType.Secondary} onClick={onClose} translation-key="common_cancel">{t('common_cancel')}</Button>
        <Button
          btnType={BtnType.Raised}
          translation-key="target_confirm_btn_confirm"
          children={<TextBtnSmall>{t('target_confirm_btn_confirm')}</TextBtnSmall>}
          onClick={onConfirm}
        />
      </DialogActionsConfirm>
    </Dialog>
  )
}
export default PopupConfirmChangeSampleSize;