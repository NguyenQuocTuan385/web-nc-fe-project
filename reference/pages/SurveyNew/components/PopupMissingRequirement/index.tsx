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
import { SETUP_SURVEY_SECTION } from 'models/project';
import { Warning as WarningIcon } from '@mui/icons-material';
import ParagraphBody from 'components/common/text/ParagraphBody';
import { useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import { useMemo } from 'react';
import ProjectHelper from 'helpers/project';

interface Props {
  isOpen: boolean,
  isValidBasic: boolean,
  isValidPacks: boolean,
  isValidAdditionalBrand: boolean,
  isValidEyeTracking: boolean,
  onClose: () => void
  onScrollSection: (section: SETUP_SURVEY_SECTION) => void,
}

const PopupMissingRequirement = ({ isOpen, isValidBasic, isValidPacks, isValidAdditionalBrand, isValidEyeTracking, onClose, onScrollSection }: Props) => {

  const { t } = useTranslation()

  const { project } = useSelector((state: ReducerType) => state.project)

  const minPack = useMemo(() => ProjectHelper.minPack(project), [project])

  const minAdditionalBrand = useMemo(() => ProjectHelper.minAdditionalBrand(project), [project])

  const minEyeTrackingPack = useMemo(() => ProjectHelper.minEyeTrackingPack(project), [project])

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitleConfirm>
        <Box display="flex">
          <WarningIcon sx={{ fontSize: 32, color: "var(--warning)", mr: 2 }} />
          <Heading3 $colorName='--cimigo-blue-dark-3' translation-key="setup_survey_popup_missing_required_title">{t("setup_survey_popup_missing_required_title")}</Heading3>
        </Box>
        <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onClose} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody $colorName='--gray-80' translation-key="setup_survey_popup_missing_required_subtitle">{t("setup_survey_popup_missing_required_subtitle")}</ParagraphBody>
        <ul className={classes.list}>
          {!isValidBasic && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'translation-key="setup_survey_popup_missing_required_basic_information_required">
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.basic_information)} className="cursor-pointer underline" translation-key="setup_survey_popup_missing_required_basic_information">{t("setup_survey_popup_missing_required_basic_information")}</span> {t("setup_survey_popup_missing_required_basic_information_required")}
            </ParagraphBody>
          )}
          {!isValidPacks && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'translation-key="setup_survey_popup_missing_required_upload_pack_min">
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.upload_packs)} className="cursor-pointer underline" translation-key="setup_survey_popup_missing_required_upload_pack">{t("setup_survey_popup_missing_required_upload_pack")}</span> {t("setup_survey_popup_missing_required_upload_pack_min", {minPack: minPack})}
            </ParagraphBody>
          )}
          {!isValidAdditionalBrand && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80' translation-key="setup_survey_popup_missing_required_add_brands_min">
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.additional_brand_list)} className="cursor-pointer underline" translation-key="setup_survey_popup_missing_required_add_brands">{t("setup_survey_popup_missing_required_add_brands")}</span> {t("setup_survey_popup_missing_required_add_brands_min", {minAdditionalBrand: minAdditionalBrand})}
            </ParagraphBody>
          )}
          {!isValidEyeTracking && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'translation-key="setup_survey_popup_missing_required_eye_tracking_min">
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.eye_tracking)} className="cursor-pointer underline"translation-key="setup_survey_popup_missing_required_eye_tracking">{t("setup_survey_popup_missing_required_eye_tracking")}</span> {t("setup_survey_popup_missing_required_eye_tracking_min", {minEyeTrackingPack: minEyeTrackingPack})}
            </ParagraphBody>
          )}
        </ul>
        <ParagraphBody mt={4} $colorName='--gray-80' translation-key="setup_survey_popup_missing_required_remind">{t("setup_survey_popup_missing_required_remind")}</ParagraphBody>
      </DialogContentConfirm>
      <DialogActionsConfirm>
        <Button
          btnType={BtnType.Raised}
          translation-key=""
          children={<TextBtnSmall translation-key="common_ok_got_it">{t("common_ok_got_it")}</TextBtnSmall>}
          onClick={onClose}
        />
      </DialogActionsConfirm>
    </Dialog>
  )
}
export default PopupMissingRequirement;