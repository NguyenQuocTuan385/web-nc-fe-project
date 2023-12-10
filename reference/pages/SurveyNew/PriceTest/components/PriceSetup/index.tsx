import { Stack, Box } from '@mui/material';
import classes from './styles.module.scss';
import Heading5 from 'components/common/text/Heading5';
import { useTranslation } from 'react-i18next';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import PriceTag from 'components/icons/IconPriceTag';
import DashedInputField, { RenderPriceProps } from '../DashedInputField';
import RangeIcon from 'components/icons/IconRange';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'config/yup.custom';
import React, { memo, useEffect, useMemo, useState } from 'react';
import ParagraphBody from 'components/common/text/ParagraphBody';
import { Project, SETUP_SURVEY_SECTION } from 'models/project';
import PriceStepper from '../PriceStepper';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from 'redux/reducers/Status/actionTypes';
import { PriceTestService } from 'services/price_test';
import { ECurrency } from 'models/general';
import { fCurrency, fCurrencyVND } from 'utils/formatNumber';
import { ReducerType } from 'redux/reducers';
import ProjectHelper, { editableProject } from 'helpers/project';
import { EPRICE_TEST_TYPE_ID } from 'models';
import SelectPaymentPeriod from '../SelectPaymentPeriod';
import { setPriceTestReducer } from 'redux/reducers/Project/actionTypes';

interface PriceDescriptionForm {
  estimatePrice?: number;
  stepPrice?: number;
  currency?: ECurrency;
}

const PriceSetup = memo(({ project }: { project: Project }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const editable = useMemo(() => editableProject(project), [project]);

  const { triggerValidate } = useSelector(
    (state: ReducerType) => state.project
  );

  const priceTest = useMemo(() => project.priceTest, [project]);

  const schema = yup.object().shape({
    estimatePrice: yup
      .number()
      .typeError(t('price_test_price_setup_validate_empty'))
      .moreThan(0, t('price_test_price_setup_validate_min', { min: 0 }))
      .lessThan(9999999999, t('price_test_price_setup_validate_too_big'))
      .when('stepPrice', (stepPrice, schema) => {
        return !!stepPrice
          ? schema.min(
              stepPrice,
              t(
                'price_test_price_setup_validate_step_price_moreThan_estimate_price'
              )
            )
          : schema;
      }),

    stepPrice: yup
      .number()
      .moreThan(0, t('price_test_price_setup_validate_min', { min: 0 }))
      .typeError(t('price_test_price_setup_validate_empty'))
      .max(
        yup.ref('estimatePrice'),
        t('price_test_price_setup_validate_step_price_moreThan_estimate_price')
      ),

    currency: yup.string().oneOf([ECurrency.USD, ECurrency.VND]),
  });

  const { control, reset, trigger } = useForm<PriceDescriptionForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (priceTest) {
      reset({
        estimatePrice: priceTest.estimatePrice,
        stepPrice: priceTest.stepPrice,
        currency: priceTest.currency || ECurrency.VND,
      });
    }
  }, [priceTest, reset]);

  useEffect(() => {
    if (triggerValidate) trigger();
  }, [triggerValidate]);

  const onSave = (data: PriceDescriptionForm) => {
    dispatch(setLoading(true));
    PriceTestService.update(priceTest.id, data)
      .then((res) => {
        dispatch(setPriceTestReducer({ ...priceTest, ...data }));
        dispatch(setSuccessMess(res.message));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const renderPrice = (renderProps: RenderPriceProps) => {
    const { price, currency, onEditting } = renderProps;
    return (
      <Stack direction="row" spacing={1} sx={{ py: 1 }}>
        <ParagraphBody $fontWeight={500} $colorName="--eerie-black">
          {currency === ECurrency.USD ? fCurrency(price) : fCurrencyVND(price)}
        </ParagraphBody>
        {editable && (
          <ParagraphBody
            $colorName="--cimigo-blue-light-1"
            className={classes.editText}
            onClick={onEditting}
          >
            {t('price_test_price_edit')}
          </ParagraphBody>
        )}
      </Stack>
    );
  };

  return (
    <Box sx={{ mb: 3 }} id={SETUP_SURVEY_SECTION.price_step_price_setup}>
      <Heading5 translation-key="price_test_price_section_title">
        {t('price_test_price_section_title')}
      </Heading5>
      <ParagraphSmall
        sx={{ mb: 1 }}
        $colorName="--eerie-black"
        translation-key="price_test_price_section_subtitle"
      >
        {priceTest?.typeId === EPRICE_TEST_TYPE_ID.PRODUCT
          ? t('price_test_price_section_product_subtitle')
          : t('price_test_price_section_service_subtitle')}
      </ParagraphSmall>

      <Box sx={{ px: 2 }}>
        <Stack direction="row" flexWrap="wrap">
          <Stack sx={{ width: 'fit-content', mr: 2 }}>
            <Stack
              className={clsx(classes.inputWraper, classes.borderBottom)}
              direction="row"
              sx={{ py: 1, m: 0 }}
            >
              <Stack className={classes.priceLabel}>
                <PriceTag />
                <ParagraphSmall
                  sx={{ ml: 1 }}
                  $colorName="--eerie-black"
                  translation-key="price_test_price_section_estimate_price"
                >
                  {t('price_test_price_section_estimate_price')}
                </ParagraphSmall>
              </Stack>
              <DashedInputField
                rootProps={{ sx: { ml: 'auto' } }}
                viewProps={{ sx: { py: '8px !important' } }}
                inputProps={{ sx: { width: '118px' } }}
                placeholder={t(
                  'price_test_price_section_estimate_price_placeholder'
                )}
                showCurrency
                type="number"
                name="estimatePrice"
                currencyName="currency"
                render={priceTest?.estimatePrice && renderPrice}
                control={control}
                onSave={onSave}
                disabled={!editable}
              />
            </Stack>

            {priceTest?.estimatePrice && (
              <Stack
                className={classes.inputWraper}
                direction="row"
                sx={{ py: 1 }}
              >
                <Stack className={classes.priceLabel}>
                  <RangeIcon />
                  <ParagraphSmall
                    sx={{ ml: 1 }}
                    className={classes.labelInput}
                    $colorName="--eerie-black"
                    translation-key="price_test_price_section_step_price"
                  >
                    {t('price_test_price_section_step_price')}
                  </ParagraphSmall>
                </Stack>

                <DashedInputField
                  rootProps={{ sx: { ml: 'auto' } }}
                  viewProps={{ sx: { py: '8px !important' } }}
                  inputProps={{ sx: { width: '118px' } }}
                  placeholder={t(
                    'price_test_price_section_step_price_placeholder'
                  )}
                  showCurrency
                  type="number"
                  name="stepPrice"
                  control={control}
                  currencyName="currency"
                  render={priceTest?.stepPrice && renderPrice}
                  disableCurrency
                  onSave={onSave}
                  disabled={!editable}
                />
              </Stack>
            )}
          </Stack>
          {priceTest?.typeId === EPRICE_TEST_TYPE_ID.SERVICE && (
            <SelectPaymentPeriod project={project} />
          )}
        </Stack>
        {priceTest?.estimatePrice && priceTest?.stepPrice && (
          <>
            <Heading5
              sx={{ mt: 2 }}
              translation-key="price_test_price_section_price_range_survey_title"
            >
              {t('price_test_price_section_price_range_survey_title')}
            </Heading5>
            <ParagraphSmall
              sx={{ mb: 4 }}
              $colorName="--eerie-black"
              translation-key="price_test_price_section_price_range_survey_subtitle"
            >
              {t('price_test_price_section_price_range_survey_subtitle')}
            </ParagraphSmall>
            <PriceStepper project={project} />
          </>
        )}
      </Box>
    </Box>
  );
});
export default PriceSetup;
