import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import Buttons from "components/Buttons";
import classes from "./styles.module.scss";
import Images from "config/images";
import { Help } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
interface Props {
    isOpen: boolean,
    onCancel: () => void,
    onYes: ()=> void,
  }
  
const PopupConfirmDisableEyeTracking = (props: Props) => {
    const { onCancel, isOpen, onYes } = props;
    const { t } = useTranslation()
    return (
      <Dialog
        open={isOpen}
        onClose={onCancel}
        classes={{ paper: classes.paper }}
      >
        <DialogTitle className={classes.header}>
            <p translation-key="setup_survey_popup_eye_tracking_turn_off_title" className={classes.title}><Help />{t("setup_survey_popup_eye_tracking_turn_off_title")}</p>
            <IconButton onClick={onCancel}>
                <img src={Images.icClose} alt=''/>
            </IconButton>
        </DialogTitle>
        <DialogContent className={classes.body} dividers>
            <p translation-key="setup_survey_popup_eye_tracking_turn_off_advice">{t("setup_survey_popup_eye_tracking_turn_off_advice")}</p>
            <p translation-key="setup_survey_popup_eye_tracking_turn_off_question">{t("setup_survey_popup_eye_tracking_turn_off_question")}</p>
        </DialogContent>
        <DialogActions className={classes.btnBox}>
            <Buttons translation-key="common_cancel" children={t("common_cancel")} btnType="Blue" padding='11px 16px' onClick={onCancel} />
            <Buttons translation-key="setup_survey_popup_eye_tracking_turn_off_yes" children={t("setup_survey_popup_eye_tracking_turn_off_yes")} btnType="Blue" padding='11px 16px' onClick={onYes}/>
        </DialogActions>
      </Dialog>
    )
}
export default PopupConfirmDisableEyeTracking;