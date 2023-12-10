import { useForm } from "react-hook-form";
import { TabPanelProps } from 'components/TabPanel';
import { Box, Grid } from '@mui/material';
import Button, { BtnType } from "components/common/buttons/Button";
import { useTranslation } from 'react-i18next';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from 'config/yup.custom';
import { useMemo } from "react";
import InputTextField from 'components/common/inputs/InputTextfield';
import { VALIDATION } from "config/constans";
import { RegisterForm1 } from "../Step1";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import RegisterTabPanelHead from "../components/RegisterTabPanelHead";
import RegisterTabPanel from "../components/RegisterTabPanel";


export interface RegisterForm3 {
  password: string;
  confirmPassword: string;

}

interface Step3Props extends TabPanelProps {
  data: RegisterForm1
  onRegister: (data: RegisterForm3) => void
}

const RegisterStep3 = ({ data, onRegister, ...rest }: Step3Props) => {

  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      password: yup.string()
        .matches(VALIDATION.password, { message: t('field_password_vali_password'), excludeEmptyString: true })
        .required(t('field_password_vali_required')),
      confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], t('field_confirm_password_vali_password'))
        .required(t('field_confirm_password_vali_required')),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm3>({
    resolver: yupResolver(schema),
    mode: 'onChange',

  });

  return (
    <RegisterTabPanel {...rest}>
      <form onSubmit={handleSubmit(onRegister)} name="RegisterStep3" noValidate autoComplete="off">
        <Box sx={{ display: "grid" }}>
          <RegisterTabPanelHead>
            <ParagraphSmall $colorName="--gray-80" translation-key="register_sub_title_3"
              dangerouslySetInnerHTML={{
                __html: t('register_sub_title_3', { email: data?.email })
              }}
            ></ParagraphSmall>
          </RegisterTabPanelHead>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <InputTextField
                title={t('field_password')}
                translation-key="field_password"
                name="password"
                type="password"
                showEyes
                placeholder={t('field_password_placeholder')}
                translation-key-placeholder="field_password_placeholder"
                inputRef={register('password')}
                errorMessage={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputTextField
                title={t('field_confirm_password')}
                translation-key="field_confirm_password"
                name="confirmPassword"
                type="password"
                showEyes
                placeholder={t('field_confirm_password_placeholder')}
                translation-key-placeholder="field_confirm_password_placeholder"
                inputRef={register('confirmPassword')}
                errorMessage={errors.confirmPassword?.message}
              />
            </Grid>

          </Grid>

          <Button sx={{ marginTop: "32px" }} type={"submit"} translation-key="register_btn_register" children={<TextBtnSecondary>{t('register_btn_register')}</TextBtnSecondary>} btnType={BtnType.Raised} />
        </Box>
      </form>
    </RegisterTabPanel>
  )
}

export default RegisterStep3