import { memo, useEffect, useMemo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import Inputs from "components/Inputs";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { AdditionalBrand } from 'models/additional_brand';
import { useTranslation } from 'react-i18next';

export interface BrandFormData {
  brand: string;
  manufacturer: string;
  variant: string,
}

interface Props {
  isAdd: boolean,
  itemEdit: AdditionalBrand,
  onCancel: () => void,
  onSubmit: (data: BrandFormData) => void,
}

const PopupAddOrEditBrand = memo((props: Props) => {
  const { isAdd, itemEdit, onSubmit, onCancel } = props;
  const { t, i18n } = useTranslation()

  const schema = useMemo(() =>{
    return yup.object().shape({
      brand: yup.string().required(t('setup_survey_add_brand_popup_brand_required')),
      manufacturer: yup.string().required(t('setup_survey_add_brand_popup_manufacturer_required')),
      variant: yup.string().required(t('setup_survey_add_brand_popup_variant_required')),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BrandFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const _onSubmit = (data: BrandFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (!isAdd && !itemEdit) {
      reset({
        brand: '',
        manufacturer: '',
        variant: ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemEdit, isAdd])

  useEffect(() => {
    if (itemEdit) {
      reset({
        brand: itemEdit.brand,
        manufacturer: itemEdit.manufacturer,
        variant: itemEdit.variant,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemEdit])

  return (
    <Dialog
      scroll="paper"
      open={isAdd || !!itemEdit}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <form autoComplete="off" className={classes.form} noValidate onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle className={classes.header}>
          {itemEdit ? (
            <p className={classes.title} translation-key="setup_survey_add_brand_popup_edit_title">{t('setup_survey_add_brand_popup_edit_title')}</p>
          ) : (
            <p className={classes.title} translation-key="setup_survey_add_brand_popup_add_title">{t('setup_survey_add_brand_popup_add_title')}</p>
          )}
          <IconButton onClick={onCancel}>
            <img src={Images.icClose} alt='icon close' />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.body} dividers>
          <Inputs
            title={t('setup_survey_add_brand_popup_brand')}
            translation-key="setup_survey_add_brand_popup_brand"
            name="brand"
            placeholder={t('setup_survey_add_brand_popup_brand_placeholder')}
            translation-key-placeholder="setup_survey_add_brand_popup_brand_placeholder"
            inputRef={register('brand')}
            errorMessage={errors.brand?.message}
          />
          <Inputs
            title={t('setup_survey_add_brand_popup_variant')}
            translation-key="setup_survey_add_brand_popup_variant"
            name="variant"
            placeholder={t('setup_survey_add_brand_popup_variant_placeholder')}
            translation-key-placeholder="setup_survey_add_brand_popup_variant_placeholder"
            inputRef={register('variant')}
            errorMessage={errors.variant?.message}
          />
          <Inputs
            title={t('setup_survey_add_brand_popup_manufacturer')}
            translation-key="setup_survey_add_brand_popup_manufacturer"
            name="manufacturer"
            placeholder={t('setup_survey_add_brand_popup_manufacturer_placeholder')}
            translation-key-placeholder="setup_survey_add_brand_popup_manufacturer_placeholder"
            inputRef={register('manufacturer')}
            errorMessage={errors.manufacturer?.message}
          />
        </DialogContent>
        <DialogActions className={classes.btn}>
          <Buttons
            type={"submit"}
            children={itemEdit ? t('setup_survey_add_brand_popup_edit_btn') : t('setup_survey_add_brand_popup_add_btn')}
            translation-key={itemEdit ? 'setup_survey_add_brand_popup_edit_btn' : 'setup_survey_add_brand_popup_add_btn'}
            btnType='Blue'
            padding='10px 16px'
          />
        </DialogActions>
      </form>
    </Dialog>
  );
});
export default PopupAddOrEditBrand;



