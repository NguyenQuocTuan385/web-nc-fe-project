import { Box, Dialog } from '@mui/material';
import classes from './styles.module.scss';
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
import { EPRICE_TEST_TYPE_ID } from 'models';

interface Props {
  isOpen: boolean;
  isValidDescription: boolean;
  isValidPicture: boolean;
  isValidPriceSetup: boolean;
  typeTitle: EPRICE_TEST_TYPE_ID;
  onClose: () => void;
  onScrollSection: (section: SETUP_SURVEY_SECTION) => void;
}

const PopupMissingRequirement = ({
  isOpen,
  isValidDescription,
  isValidPicture,
  isValidPriceSetup,
  typeTitle,
  onClose,
  onScrollSection,
}: Props) => {
  const { t } = useTranslation();

  const { project } = useSelector((state: ReducerType) => state.project);

  const minPicture = useMemo(
    () => ProjectHelper.minPriceTestPicture(project),
    [project]
  );

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitleConfirm>
        <Box display="flex">
          <WarningIcon sx={{ fontSize: 32, color: 'var(--warning)', mr: 2 }} />
          <Heading3
            $colorName="--cimigo-blue-dark-3"
            translation-key="setup_survey_popup_missing_required_title"
          >
            {t('setup_survey_popup_missing_required_title')}
          </Heading3>
        </Box>
        <ButtonClose
          $backgroundColor="--eerie-black-5"
          $colorName="--eerie-black-40"
          onClick={onClose}
        />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody
          $colorName="--gray-80"
          translation-key="setup_survey_popup_missing_required_subtitle"
        >
          {t('setup_survey_popup_missing_required_subtitle')}
        </ParagraphBody>
        {typeTitle === EPRICE_TEST_TYPE_ID.PRODUCT && (
          <ul className={classes.list}>
            {!isValidDescription && (
              <ParagraphBody
                variant="body2"
                variantMapping={{ body2: 'li' }}
                className={classes.itemText}
                $colorName="--gray-80"
                translation-key="price_test_popup_missing_required_product_description_information"
              >
                <span
                  onClick={() =>
                    onScrollSection(SETUP_SURVEY_SECTION.price_step_description)
                  }
                  className="cursor-pointer underline"
                  translation-key="price_test_popup_missing_required_product_description_information"
                >
                  {t(
                    'price_test_popup_missing_required_product_description_information'
                  )}
                </span>{' '}
                {t('price_test_popup_missing_required_information_required')}
              </ParagraphBody>
            )}
            {!isValidPicture && (
              <ParagraphBody
                variant="body2"
                variantMapping={{ body2: 'li' }}
                className={classes.itemText}
                $colorName="--gray-80"
                translation-key="price_test_popup_missing_required_product_picture"
              >
                <span
                  onClick={() =>
                    onScrollSection(SETUP_SURVEY_SECTION.price_step_picture)
                  }
                  className="cursor-pointer underline"
                  translation-key="price_test_popup_missing_required_product_picture"
                >
                  {t('price_test_popup_missing_required_product_picture')}
                </span>{' '}
                {t('setup_survey_popup_missing_pictures_min', {
                  min: minPicture,
                })}
              </ParagraphBody>
            )}
            {!isValidPriceSetup && (
              <ParagraphBody
                variant="body2"
                variantMapping={{ body2: 'li' }}
                className={classes.itemText}
                $colorName="--gray-80"
                translation-key="price_test_popup_missing_required_product_price_setup"
              >
                <span
                  onClick={() =>
                    onScrollSection(SETUP_SURVEY_SECTION.price_step_price_setup)
                  }
                  className="cursor-pointer underline"
                  translation-key="price_test_popup_missing_required_product_price_setup"
                >
                  {t('price_test_popup_missing_required_product_price_setup')}
                </span>{' '}
                {t('price_test_popup_missing_required_information_required')}
              </ParagraphBody>
            )}
          </ul>
        )}
        {typeTitle === EPRICE_TEST_TYPE_ID.SERVICE && (
          <ul className={classes.list}>
            {!isValidDescription && (
              <ParagraphBody
                variant="body2"
                variantMapping={{ body2: 'li' }}
                className={classes.itemText}
                $colorName="--gray-80"
                translation-key="price_test_popup_missing_required_service_description_information"
              >
                <span
                  onClick={() =>
                    onScrollSection(SETUP_SURVEY_SECTION.price_step_description)
                  }
                  className="cursor-pointer underline"
                  translation-key="price_test_popup_missing_required_service_description_information"
                >
                  {t(
                    'price_test_popup_missing_required_service_description_information'
                  )}
                </span>{' '}
                {t('price_test_popup_missing_required_information_required')}
              </ParagraphBody>
            )}
            {!isValidPicture && (
              <ParagraphBody
                variant="body2"
                variantMapping={{ body2: 'li' }}
                className={classes.itemText}
                $colorName="--gray-80"
                translation-key="price_test_popup_missing_required_service_picture"
              >
                <span
                  onClick={() =>
                    onScrollSection(SETUP_SURVEY_SECTION.price_step_picture)
                  }
                  className="cursor-pointer underline"
                  translation-key="price_test_popup_missing_required_service_picture"
                >
                  {t('price_test_popup_missing_required_service_picture')}
                </span>{' '}
                {t('setup_survey_popup_missing_pictures_min', {
                  min: minPicture,
                })}
              </ParagraphBody>
            )}
            {!isValidPriceSetup && (
              <ParagraphBody
                variant="body2"
                variantMapping={{ body2: 'li' }}
                className={classes.itemText}
                $colorName="--gray-80"
                translation-key="price_test_popup_missing_required_service_price_setup"
              >
                <span
                  onClick={() =>
                    onScrollSection(SETUP_SURVEY_SECTION.price_step_price_setup)
                  }
                  className="cursor-pointer underline"
                  translation-key="price_test_popup_missing_required_service_price_setup"
                >
                  {t('price_test_popup_missing_required_service_price_setup')}
                </span>{' '}
                {t('price_test_popup_missing_required_information_required')}
              </ParagraphBody>
            )}
          </ul>
        )}
        <ParagraphBody
          mt={4}
          $colorName="--gray-80"
          translation-key="setup_survey_popup_missing_required_remind"
        >
          {t('setup_survey_popup_missing_required_remind')}
        </ParagraphBody>
      </DialogContentConfirm>
      <DialogActionsConfirm>
        <Button
          btnType={BtnType.Raised}
          children={
            <TextBtnSmall translation-key="common_ok_got_it">
              {t('common_ok_got_it')}
            </TextBtnSmall>
          }
          onClick={onClose}
        />
      </DialogActionsConfirm>
    </Dialog>
  );
};
export default PopupMissingRequirement;
