import { memo, useEffect, useMemo, useState } from 'react';
import { Dialog, FormControlLabel, Grid } from '@mui/material';
import classes from './styles.module.scss';
import { OptionItem } from 'models/general';
import * as yup from 'yup';
import { VALIDATION } from 'config/constans';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { setErrorMess, setLoading, setSuccessMess } from 'redux/reducers/Status/actionTypes';
import CountryService from 'services/country';
import InputSelect from 'components/common/inputs/InputSelect';
import { Payment, UpdateInvoiceInfo } from 'models/payment';
import { getProjectRequest } from 'redux/reducers/Project/actionTypes';
import { PaymentService } from 'services/payment';
import { ReducerType } from 'redux/reducers';
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from 'components/common/text/Heading3';
import ButtonCLose from 'components/common/buttons/ButtonClose';
import ParagraphBody from 'components/common/text/ParagraphBody';
import TextBtnSecondary from 'components/common/text/TextBtnSecondary';
import Button, { BtnType } from 'components/common/buttons/Button';
import InputCheckbox from 'components/common/inputs/InputCheckbox';
import InputTextfield from "components/common/inputs/InputTextfield";
import TooltipCustom from 'components/Tooltip';
import { InfoOutlined } from '@mui/icons-material';

interface Props {
  payment: Payment,
  isOpen: boolean,
  onClose: () => void,
}

export interface InvoiceInfoData {
  fullName: string,
  companyName: string,
  title: string,
  email: string,
  phone: string,
  countryId: OptionItem,
  companyAddress: string,
  taxCode: string,
  saveForLater: boolean,
}


const PopupInvoiceInformation = memo((props: Props) => {
  const { isOpen, onClose, payment } = props;
  const { t, i18n } = useTranslation()
  const [countries, setCountries] = useState<OptionItem[]>([])
  const dispatch = useDispatch()
  const { project } = useSelector((state: ReducerType) => state.project)

  const schema = useMemo(() => {
    return yup.object().shape({
      fullName: yup.string().required(t('field_full_name_vali_required')),
      companyName: yup.string().required(t('field_company_vali_required')),
      title: yup.string()
        .required(t('field_your_title_vali_required')),
      email: yup.string().email(t('field_email_vali_email'))
        .required(t('field_email_vali_required')),
      phone: yup.string().matches(VALIDATION.phone, { message: t('field_phone_number_vali_phone'), excludeEmptyString: true })
        .required(t('field_phone_number_vali_required')),
      countryId: yup.object().shape({
        id: yup.number().required(t('field_country_vali_required')),
        name: yup.string().required()
      }).required(),
      companyAddress: yup.string().required(t('field_company_address_vali_required')),
      taxCode: yup.string(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<InvoiceInfoData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    reset({
      fullName: payment?.fullName || '',
      companyName: payment?.companyName || '',
      title: payment?.title || '',
      email: payment?.email || '',
      phone: payment?.phone || '',
      countryId: payment?.country ? { id: payment.country.id, name: payment.country.name } : undefined,
      companyAddress: payment?.companyAddress || '',
      taxCode: payment?.taxCode || ''
    })
  }, [payment, reset])

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true))
      const data = await CountryService.getCountries({ take: 9999 })
        .catch((e) => {
          dispatch(setErrorMess(e))
          return null
        })
      setCountries(data?.data || [])
      dispatch(setLoading(false))
    }
    fetchData()
  }, [dispatch])

  const onSubmit = (data: InvoiceInfoData) => {
    const form: UpdateInvoiceInfo = {
      saveForLater: data.saveForLater,
      fullName: data.fullName,
      companyName: data.companyName,
      title: data.title,
      email: data.email,
      companyAddress: data.companyAddress,
      phone: data.phone,
      countryId: data.countryId.id,
      taxCode: data.taxCode || '',
    }
    dispatch(setLoading(true))
    PaymentService.updateInvoiceInfo(payment.id, form)
      .then((res) => {
        dispatch(getProjectRequest(project.id))
        onClose()
        dispatch(setSuccessMess(res.message));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <DialogTitle>
          <Heading3 translation-key="pay_popup_invoice_infor_title">
            {t("pay_popup_invoice_infor_title")}
          </Heading3>
          <ButtonCLose onClick={onClose} />
        </DialogTitle>
        <DialogContent className={classes.body}>
          <ParagraphBody sx={{ mb: { xs: 2, sm: 3 } }} $colorName="--gray-90" translation-key="pay_popup_invoice_infor_sub_title"></ParagraphBody>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <InputTextfield
                title={t('field_full_name')}
                translation-key="field_full_name"
                placeholder={t('field_full_name_placeholder')}
                translation-key-placeholder="field_full_name_placeholder"
                name="fullName"
                inputRef={register('fullName')}
                errorMessage={errors.fullName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputTextfield
                title={t('field_company')}
                translation-key="field_company"
                placeholder={t('field_company_placeholder')}
                translation-key-placeholder="field_company_placeholder"
                name="companyName"
                inputRef={register('companyName')}
                errorMessage={errors.companyName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputTextfield
                title={t('field_your_title')}
                translation-key="field_your_title"
                placeholder={t('field_your_title_placeholder')}
                translation-key-placeholder="field_your_title_placeholder"
                name="title"
                inputRef={register('title')}
                errorMessage={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputTextfield
                title={t('field_email')}
                translation-key="field_email"
                placeholder={t('field_email_placeholder')}
                translation-key-placeholder="field_email_placeholder"
                name="email"
                inputRef={register('email')}
                errorMessage={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputTextfield
                title={t('field_phone_number')}
                translation-key="field_phone_number"
                placeholder={t('field_phone_number_placeholder')}
                translation-key-placeholder="field_phone_number_placeholder"
                name="phone"
                inputRef={register('phone')}
                errorMessage={errors.phone?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputSelect
                fullWidth
                title={t('field_country')}
                name="countryId"
                control={control}
                selectProps={{
                  options: countries,
                  placeholder: t('field_country_placeholder'),
                }}
                errorMessage={(errors.countryId as any)?.id?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputTextfield
                title={t('field_company_address')}
                translation-key="field_company_address"
                placeholder={t('field_company_address_placeholder')}
                translation-key-placeholder="field_company_address_placeholder"
                name="companyAddress"
                inputRef={register('companyAddress')}
                errorMessage={errors.companyAddress?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputTextfield
                optional
                title={t('field_tax_code_for_invoice')}
                translation-key="field_tax_code_for_invoice"
                placeholder={t('field_tax_code_for_invoice_placeholder')}
                translation-key-placeholder="field_tax_code_for_invoice_placeholder"
                name="taxCode"
                inputRef={register('taxCode')}
                errorMessage={errors.taxCode?.message}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.tips}>
            <FormControlLabel
              control={
                <Controller
                  name="saveForLater"
                  control={control}
                  render={({ field }) =>
                    <InputCheckbox
                      checked={field.value}
                      onChange={field.onChange}
                    />}
                />
              }
              translation-key="payment_billing_sub_tab_payment_save_for_later"
              label={<>{t('payment_billing_sub_tab_payment_save_for_later')}</>}
            />
            <TooltipCustom popperClass={classes.popperClass} title={t('payment_billing_sub_tab_payment_save_for_later_tip')} translation-key="payment_billing_sub_tab_payment_save_for_later_tip">
              <InfoOutlined sx={{ ml: 0.5, fontSize: 16, color: "var(--eerie-black-40)" }} />
            </TooltipCustom>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            btnType={BtnType.Raised}
            type="submit"
            translation-key=""
            children={<TextBtnSecondary translation-key="common_save_information">{t("common_save_information")}</TextBtnSecondary>}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
});
export default PopupInvoiceInformation;



