import { useForm } from "react-hook-form";
import Google from 'components/SocialButton/Google';
import { Box, Grid } from '@mui/material';
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphExtraSmall from 'components/common/text/ParagraphExtraSmall';
import { useTranslation } from 'react-i18next';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import { routes, routesOutside } from 'routers/routes';
import { useDispatch } from 'react-redux';
import InputTextfield from 'components/common/inputs/InputTextfield';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'config/yup.custom';
import { OptionItem } from "models/general";
import { useMemo } from "react";
import InputTextField from 'components/common/inputs/InputTextfield';
import InputSelect from 'components/common/inputs/InputSelect';
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import UserService from "services/user";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import RegisterTabPanelText from "../components/RegisterTabPanelText";
import { Link } from "react-router-dom";
import Separator from "components/common/separator";
import { TabPanelProps } from "components/TabPanel";
import RegisterTabPanelHead from "../components/RegisterTabPanelHead";
import RegisterTabPanel from "../components/RegisterTabPanel";


export interface RegisterForm1 {
  firstName: string;
  lastName: string;
  email: string;
  countryId: OptionItem;
}

interface Step1Props extends TabPanelProps {
  countries?: OptionItem[]
  onNext: (data: RegisterForm1) => void
}


const RegisterStep1 = ({ onNext, countries, ...rest }: Step1Props) => {

  const { t, i18n } = useTranslation()

  const dispatch = useDispatch()

  const schema = useMemo(() => {
    return yup.object().shape({
      firstName: yup.string()
        .required(t('field_first_name_vali_required')),
      lastName: yup.string()
        .required(t('field_last_name_vali_required')),
      email: yup.string()
        .email(t('field_email_vali_email'))
        .businessEmail(t("field_email_vali_business"))
        .required(t('field_email_vali_required')),
      countryId: yup.object().shape({
        id: yup.number().required(t('field_country_vali_required')),
        name: yup.string().required()
      }).required(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterForm1>({
    resolver: yupResolver(schema),
    mode: 'onChange',

  });


  const onSubmit = (data: RegisterForm1) => {
    dispatch(setLoading(true));
    UserService.checkEmail(data?.email)
      .then(() => onNext(data))
      .catch((error) => {
        dispatch(setErrorMess(error));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  return (
    <RegisterTabPanel {...rest}>
      <form onSubmit={handleSubmit(onSubmit)} name="RegisterStep1" noValidate autoComplete="off">
        <Box sx={{ display: "grid" }}>

          <RegisterTabPanelHead>
            <ParagraphSmall $colorName="--gray-80" translation-key="register_sub_title_1">{t('register_sub_title_1')}</ParagraphSmall>
          </RegisterTabPanelHead>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputTextfield
                title={t('field_first_name')}
                translation-key="field_first_name"
                name="firstName"
                placeholder={t('field_first_name_placeholder')}
                translation-key-placeholder="field_first_name_placeholder"
                type="text"
                inputRef={register('firstName')}
                errorMessage={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputTextfield
                title={t('field_last_name')}
                translation-key="field_last_name"
                name="lastName"
                placeholder={t('field_last_name_placeholder')}
                translation-key-placeholder="field_last_name_placeholder"
                type="text"
                inputRef={register('lastName')}
                errorMessage={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputTextField
                title={t('field_email')}
                translation-key="field_email"
                name="email"
                placeholder={t('field_business_email_placeholder')}
                translation-key-placeholder="field_business_email_placeholder"
                type="text"
                inputRef={register('email')}
                errorMessage={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
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
            </Grid >
          </Grid>

          <Button sx={{ marginTop: "32px" }} type="submit" translation-key="auth_button_continue" children={<TextBtnSecondary>{t('auth_button_continue')}</TextBtnSecondary>} btnType={BtnType.Raised} />

          <RegisterTabPanelText>
            <ParagraphExtraSmall $colorName="--gray-60" translation-key="register_agree_message_1">{t('register_agree_message_1')}
              <a href={routesOutside(i18n.language)?.rapidsurveyTermsOfService} translation-key="register_agree_message_2">{t('register_agree_message_2')}</a>
            </ParagraphExtraSmall>
          </RegisterTabPanelText>

          <RegisterTabPanelText>
            <ParagraphSmall $colorName="--gray-80" translation-key="auth_already_have_account">{t('auth_already_have_account')}
              <Link style={{ color: "var(--cimigo-blue)", fontSize: "14px", textDecoration: "underline" }}
                to={routes.login} translation-key="login_title">
                {t('login_title')}
              </Link>
            </ParagraphSmall>
          </RegisterTabPanelText>

          <Separator color="red">
            <ParagraphSmall $colorName="--gray-80" translation-key="register_register_with">{t('register_register_with')}</ParagraphSmall>
          </Separator>
          <Google>{t('register_btn_with', { name: 'Google' })}</Google>
        </Box>

      </form>
    </RegisterTabPanel>
  )
}

export default RegisterStep1