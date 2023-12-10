import { memo, useEffect, useMemo, useState } from 'react';
import { Box, Menu, MenuItem, Stack } from '@mui/material';
import classes from './styles.module.scss';
import clsx from 'clsx';
import { Check, KeyboardArrowDown } from '@mui/icons-material';
import Heading5 from 'components/common/text/Heading5';
import TextBtnSmall from 'components/common/text/TextBtnSmall';
import { useTranslation } from 'react-i18next';
import Button, { BtnType } from 'components/common/buttons/Button';
import IconLanguage from 'components/IconLanguage';
import InputTextfield from 'components/common/inputs/InputTextfield';
import ParagraphBody from 'components/common/text/ParagraphBody';
import { EPaymentPeriodType, paymentPeriodTypes } from 'models/price_test';
import { Project } from 'models/project';
import { useDispatch, useSelector } from 'react-redux';
import { PriceTestService } from 'services/price_test';
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from 'redux/reducers/Status/actionTypes';
import { setPriceTestReducer } from 'redux/reducers/Project/actionTypes';
import ProjectHelper, { editableProject } from 'helpers/project';
import { ReducerType } from 'redux/reducers';

interface PaymentPeriodProps {
  paymentPeriod?: EPaymentPeriodType;
  customPaymentPeriod?: string;
}

const SelectPaymentPeriod = memo(({ project }: { project: Project }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [paymentPeriodData, setPaymentPeriodData] =
    useState<PaymentPeriodProps>({});
  const [errorValidate, setErrorValidate] = useState(false);
  const editable = useMemo(() => editableProject(project), [project]);

  const isValidPaymentPeriod = useMemo(
    () => ProjectHelper.isValidPaymentPeriod(project),
    [project.priceTest]
  );
  const onCloseMenu = () => {
    setMenuAnchorEl(null);
    setPaymentPeriodData({
      paymentPeriod: project?.priceTest?.paymentPeriod,
      customPaymentPeriod: project?.priceTest?.customPaymentPeriod,
    });
  };

  const onOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!editable) return;
    setMenuAnchorEl(e.currentTarget);
  };

  const { triggerValidate } = useSelector(
    (state: ReducerType) => state.project
  );

  useEffect(() => {
    if (project?.priceTest) {
      setPaymentPeriodData({
        paymentPeriod: project?.priceTest?.paymentPeriod,
        customPaymentPeriod: project?.priceTest?.customPaymentPeriod || '',
      });
    }
  }, [project?.priceTest]);

  useEffect(() => {
    if (triggerValidate && !isValidPaymentPeriod) setErrorValidate(true);
    else setErrorValidate(false);
  }, [triggerValidate, isValidPaymentPeriod]);

  const onChangePaymentPeriod = (data: PaymentPeriodProps) => {
    if (data.paymentPeriod != EPaymentPeriodType.OTHER) return onSubmit(data);
    setPaymentPeriodData(data);
  };

  const onSubmit = (data: PaymentPeriodProps) => {
    if (
      !data.paymentPeriod ||
      (data.paymentPeriod == EPaymentPeriodType.OTHER &&
        !data.customPaymentPeriod)
    )
      return;
    dispatch(setLoading(true));
    PriceTestService.update(project.priceTest.id, data)
      .then((res) => {
        onCloseMenu();
        dispatch(
          setPriceTestReducer({
            ...project.priceTest,
            paymentPeriod: data.paymentPeriod,
            customPaymentPeriod: data.customPaymentPeriod,
          })
        );
        dispatch(setSuccessMess(res.message));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const paymentTypeLabel = useMemo(() => {
    if (!paymentPeriodData?.paymentPeriod)
      return t('price_test_choose_payment_type_title');

    const paymentPeriodName = paymentPeriodTypes.find(
      (payment) => payment.id === paymentPeriodData?.paymentPeriod
    )?.name;

    if (paymentPeriodData?.paymentPeriod === EPaymentPeriodType.OTHER)
      return `${t(paymentPeriodName)} (${
        paymentPeriodData?.customPaymentPeriod
      })`;
    return t(paymentPeriodName);
  }, [paymentPeriodData]);

  return (
    <Box className={classes.root}>
      <Button
        className={clsx(classes.pricingMenuBtn, {
          [classes.error]: errorValidate,
        })}
        variant="text"
        endIcon={editable && <KeyboardArrowDown />}
        disableRipple={!editable}
        onClick={onOpenMenu}
      >
        <Heading5
          className={classes.label}
          $colorName="--gray-90"
          $fontWeight={400}
        >
          {paymentTypeLabel}
        </Heading5>
      </Button>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={onCloseMenu}
        className={classes.selectPricingmenu}
      >
        {paymentPeriodTypes.map((paymentType) => (
          <MenuItem
            onKeyDown={(e) => e.stopPropagation()}
            key={paymentType.id}
            sx={{ p: 0 }}
            onClick={() =>
              onChangePaymentPeriod({
                paymentPeriod: paymentType.id,
                customPaymentPeriod:
                  paymentType.id !== EPaymentPeriodType.OTHER
                    ? ''
                    : paymentPeriodData.customPaymentPeriod,
              })
            }
          >
            <Stack
              className={clsx(classes.menuItem, {
                [classes.active]:
                  paymentPeriodData.paymentPeriod === paymentType.id,
              })}
            >
              <ParagraphBody className={classes.paymentTypeText}>
                {t(paymentType.name)} {t(paymentType.subName)}
                {paymentPeriodData.paymentPeriod === paymentType.id && (
                  <Check />
                )}
              </ParagraphBody>
              {paymentPeriodData.paymentPeriod === EPaymentPeriodType.OTHER &&
                paymentType.id === EPaymentPeriodType.OTHER && (
                  <InputTextfield
                    sx={{ mt: 1 }}
                    autoFocus
                    translation-key="brand_track_field_project_category"
                    value={paymentPeriodData.customPaymentPeriod ?? ''}
                    onChange={(e) =>
                      onChangePaymentPeriod({
                        paymentPeriod: EPaymentPeriodType.OTHER,
                        customPaymentPeriod: e.target.value,
                      })
                    }
                    placeholder={t(
                      'price_test_choose_payment_type_placeholder'
                    )}
                    translation-key-placeholder="price_test_choose_payment_type_placeholder"
                    startAdornment={
                      <IconLanguage
                        translationKey={`solution_type_3_setup_survey_category_name_tooltip`}
                        surveyLanguage={project?.surveyLanguage}
                      />
                    }
                    className={classes.categoryInput}
                  />
                )}
            </Stack>
          </MenuItem>
        ))}
        {paymentPeriodData.paymentPeriod === EPaymentPeriodType.OTHER && (
          <MenuItem className={classes.menuAction} disableRipple>
            <Stack className={classes.actionBtnWrapper}>
              <Button
                btnType={BtnType.Secondary}
                translation-key="common_cancel"
                children={<TextBtnSmall>{t('common_cancel')}</TextBtnSmall>}
                className={classes.btnCancel}
                onClick={onCloseMenu}
              />
              <Button
                btnType={BtnType.Raised}
                disabled={!paymentPeriodData.customPaymentPeriod}
                translation-key="common_save"
                children={<TextBtnSmall>{t('common_save')}</TextBtnSmall>}
                className={classes.btnSave}
                onClick={() => onSubmit(paymentPeriodData)}
              />
            </Stack>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
});
export default SelectPaymentPeriod;
