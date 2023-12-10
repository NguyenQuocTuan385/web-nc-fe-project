import { useForm } from "react-hook-form";
import { Box, Grid } from '@mui/material';
import Button, { BtnType } from "components/common/buttons/Button";
import { useTranslation } from 'react-i18next';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'config/yup.custom';
import { useMemo } from "react";
import InputTextField from 'components/common/inputs/InputTextfield';
import { VALIDATION } from "config/constans";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import RegisterTabPanelHead from "../components/RegisterTabPanelHead";
import { TabPanelProps } from "components/TabPanel";
import RegisterTabPanel from "../components/RegisterTabPanel";


export interface RegisterForm2 {
  phone: string;
  company: string;
  title: string;
}

interface Step2Props extends TabPanelProps {
  onNext: (data: RegisterForm2) => void
}

const RegisterStep2 = ({ onNext, ...rest }: Step2Props) => {
  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({

      phone: yup.string().matches(VALIDATION.phone, { message: t('field_phone_number_vali_phone'), excludeEmptyString: true }),
      company: yup.string(),
      title: yup.string(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm2>({
    resolver: yupResolver(schema),
    mode: 'onChange',

  });

  const onSubmit = (data: RegisterForm2) => {
    onNext(data)
  }

  const onSkip = () => {
    onNext({
      phone: "",
      company: "",
      title: ""
    })
  }

  return (
    <RegisterTabPanel {...rest}>
      <form onSubmit={handleSubmit(onSubmit)} name="RegisterStep2" noValidate autoComplete="off">
        <Box sx={{ display: "grid" }}>

          <RegisterTabPanelHead>
            <ParagraphSmall $colorName="--gray-80" translation-key="register_sub_title_2">{t('register_sub_title_2')}</ParagraphSmall>
          </RegisterTabPanelHead>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <InputTextField
                title={t('field_phone_number')}
                translation-key="field_phone_number"
                name="phone"
                type="text"
                inputRef={register('phone')}
                placeholder={t('field_phone_number_placeholder')}
                translation-key-placeholder="field_phone_number_placeholder"
                errorMessage={errors.phone?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputTextField
                title={t('field_company')}
                translation-key="field_company"
                name="company"
                type="text"
                inputRef={register('company')}
                placeholder={t('field_company_placeholder')}
                translation-key-placeholder="field_company_placeholder"
                errorMessage={errors.company?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputTextField
                title={t('field_your_title')}
                translation-key="field_your_title"
                name="title"
                type="text"
                placeholder={t('field_your_title_placeholder')}
                translation-key-placeholder="field_your_title_placeholder"
                inputRef={register('title')}
                errorMessage={errors.title?.message}
              />
            </Grid>
          </Grid>


          <Button sx={{ marginTop: "32px" }} type="submit" translation-key="auth_button_continue" children={<TextBtnSecondary>{t('auth_button_continue')}</TextBtnSecondary>} btnType={BtnType.Raised} />
          <Button sx={{ width: "100%", marginTop: "16px" }} translation-key="auth_button_skip" onClick={onSkip} children={<TextBtnSecondary>{t('auth_button_skip')}</TextBtnSecondary>} btnType={BtnType.Text} />
        </Box>

      </form>
    </RegisterTabPanel>
  )
}

export default RegisterStep2